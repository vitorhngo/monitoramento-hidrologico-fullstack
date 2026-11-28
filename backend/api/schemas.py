from drf_spectacular.utils import extend_schema, OpenApiParameter, OpenApiResponse

# Personaliza a documentação OpenAPI (descrição, parâmetros e respostas) exibida no Swagger e ReDoc.

station_summary_schema = extend_schema(
    summary="Resumo de uma estação",
    description=(
        "Retorna os dados cadastrais da estação "
        "e suas últimas leituras de nível e chuva."
    ),
    responses={
        200: OpenApiResponse(
            description="Resumo da estação retornado com sucesso."
        ),
        404: OpenApiResponse(
            description="Estação não encontrada."
        ),
    },
)

station_series_schema = extend_schema(
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

