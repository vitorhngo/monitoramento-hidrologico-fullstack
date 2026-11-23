import django_filters
from .models import Station


class StationFilter(django_filters.FilterSet):
    # Busca parcial, sem diferenciar maiúsculas de minúsculas
    id = django_filters.CharFilter(lookup_expr='iexact')
    name = django_filters.CharFilter(lookup_expr='icontains')
    river = django_filters.CharFilter(lookup_expr='icontains')
    municipality = django_filters.CharFilter(lookup_expr='icontains')

    class Meta:
        model = Station
        fields = ['id', 'name', 'river', 'municipality']