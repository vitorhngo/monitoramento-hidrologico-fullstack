from datetime import timedelta

from django.utils import timezone
from drf_spectacular.utils import extend_schema, OpenApiParameter, OpenApiResponse
from rest_framework import viewsets, status # viewsets para criar CRUD da API automaticamente
from rest_framework.decorators import action
from rest_framework.response import Response
from monitoring.models import Station, Observation # modelos do app monitoring
from .serializers import StationSerializer, ObservationPointSerializer
from django_filters.rest_framework import DjangoFilterBackend
from .filters import StationFilter
from rest_framework.renderers import JSONRenderer
from .renderers import SeriesBrowsableRenderer

from django.shortcuts import redirect  # Redireciona o navegador para outra rota.
from django.urls import reverse  # Obtém a URL a partir do nome de uma rota.
from rest_framework.renderers import BrowsableAPIRenderer  # Identifica requisições feitas pela interface HTML do DRF.

# Unidade de cada métrica (a mesma regra da constraint chk_obs_metric_unit_match do model)
UNIT_BY_METRIC = {
    Observation.Metric.LEVEL: Observation.Unit.METERS,
    Observation.Metric.RAIN: Observation.Unit.MM_PER_HOUR,
}

DEFAULT_HOURS = 24
MIN_HOURS = 1
MAX_HOURS = 72


# ViewSet para o recurso Station:
# - fornece endpoints padrão (list, retrieve, create, update, destroy) pelo ModelViewSet,
class StationViewSet(viewsets.ModelViewSet):
    queryset = Station.objects.all().order_by('id') # queryset base, ordenado por id
    serializer_class = StationSerializer # serializer usado para (de)serializar Station

    filter_backends = [DjangoFilterBackend]  # habilita filtragem via django-filter
    filterset_class = StationFilter

    # Na tela do DRF, o link "Series" do menu "Ações Extras" passa a vir com metric e hours preenchidos,
    # em vez de abrir a URL sem parâmetros (que retornaria erro 400).
    def get_extra_action_url_map(self):
        urls = super().get_extra_action_url_map()
        for name, url in list(urls.items()):
            if name.lower() == 'series':
                urls[name] = f'{url}?metric=level&hours={DEFAULT_HOURS}'
        return urls


    # Personaliza a resposta filtro id
    def list(self, request, *args, **kwargs):

        station_id = request.query_params.get('id')

        is_browsable = isinstance(
            request.accepted_renderer,
            BrowsableAPIRenderer
        )

        if station_id and is_browsable:

            station = self.get_queryset().filter(
                pk=station_id
            ).first()

            if station:
                url = reverse(
                    'station-detail',
                    kwargs={'pk': station.pk}
                )

                return redirect(url)

        return super().list(request, *args, **kwargs)

    
    # GET /api/stations/{id}/series?metric=level&hours=24 
    # GET /api/stations/{id}/series?metric=rain&hours=24
    # Personaliza a documentação do endpoint no padrão OpenAPI,definindo descrição, parâmetros aceitos e possíveis respostas HTTP.
    # Essas informações são exibidas no Swagger e no ReDoc.
    @extend_schema(
        summary="Histórico de nível ou chuva de uma estação",
        description=(
            "Devolve as leituras da estação, em ordem de horário (UTC), "
            "para a métrica e a janela de horas escolhidas. Dados simulados."
        ),
        parameters=[
            OpenApiParameter(
                name='metric',
                type=str,
                location=OpenApiParameter.QUERY,
                required=True,
                enum=['level', 'rain'],
                description="Métrica: 'level' (nível, em m) ou 'rain' (chuva, em mm/h).",
            ),
            OpenApiParameter(
                name='hours',
                type={'type': 'integer', 'minimum': 1, 'maximum': 72, 'default': 24},
                location=OpenApiParameter.QUERY,
                required=False,
                description="Janela de tempo em horas, de 1 a 72. Padrão: 24.",
            ),
        ],
        responses={
            200: OpenApiResponse(description="Série histórica da estação."),
            400: OpenApiResponse(description="Parâmetro 'metric' ou 'hours' inválido."),
            404: OpenApiResponse(description="Estação não encontrada."),
        },
    )
    @action(
        detail=True,
        methods=['get'],
        url_path='series',
        renderer_classes=[JSONRenderer, SeriesBrowsableRenderer],  # JSON normal + tela do DRF com formulário
    )
    def series(self, request, pk=None):
        """
        Histórico de nível ou chuva de uma estação (dados simulados).

        Parâmetros na URL:
        - metric: 'level' (nível, em m) ou 'rain' (chuva, em mm/h). Obrigatório.
        - hours: janela em horas, de 1 a 72. Padrão: 24.

        Exemplo: /api/stations/EST-01/series?metric=level&hours=24
        Para um formulário interativo, use /api/docs/.
        """
        station = self.get_object() # 404 automático se a estação não existe

        # Valida a métrica (obrigatória)
        metric = request.query_params.get('metric')
        if metric not in Observation.Metric.values:
            return Response(
                {'error': "Parâmetro 'metric' obrigatório e deve ser 'level' ou 'rain'."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Valida a janela de horas (opcional, padrão 24, entre 1 e 72)
        try:
            hours = int(request.query_params.get('hours', DEFAULT_HOURS))
        except ValueError:
            hours = None
        if hours is None or not (MIN_HOURS <= hours <= MAX_HOURS):
            return Response(
                {'error': f"Parâmetro 'hours' deve ser um número inteiro entre {MIN_HOURS} e {MAX_HOURS}."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        since = timezone.now() - timedelta(hours=hours) # Define o horário de início da busca
        observations = (
            station.observations # Acessa apenas as observações vinculadas a esta estação específica
            .filter(metric=metric, observed_at__gte=since) # Filtra pela métrica desejada e pega apenas registros feitos a partir da data de corte (maior ou igual)
            .order_by('observed_at') # Ordena os resultados do mais antigo para o mais recente (ordem cronológica)
        )

        return Response({
            'station_id': station.id,
            'metric': metric,
            'unit': UNIT_BY_METRIC[metric],
            'hours': hours,
            'simulated': True, # dados fictícios (exigência do desafio)
            'source': Observation.Source.SYNTHETIC,
            'points': ObservationPointSerializer(observations, many=True).data, 
        })

    # GET /api/stations/{id}/summary
    @action(detail=True, methods=["get"], url_path="summary")
    def summary(self, request, pk=None):
        station = self.get_object() # Identifica a estação pelo ID informado na URL e retorna HTTP 404 caso a estação não exista.
        latest_readings = {} # Armazena a última leitura encontrada de cada métrica.

        for metric in (Observation.Metric.LEVEL, Observation.Metric.RAIN):
            observation = (
                Observation.objects.filter(station=station, metric=metric) # Filtra as observações pela estação e pela métrica.
                .order_by("-observed_at", "-id") # Ordena da mais recente para a mais antiga.
                .first() # Recupera somente o primeiro registro.
            )

            # Se existir uma observação, armazena seus dados.Caso contrário, retorna None para indicar ausência de leitura.
            latest_readings[metric] = (
                {
                    "value": observation.value,
                    "unit": observation.unit,
                    "observed_at": observation.observed_at,
                }
                if observation is not None
                else None
            )

        return Response({
            "is_simulated": True,
            "station": self.get_serializer(station).data,
            "latest_readings": latest_readings,
        })