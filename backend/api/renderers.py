from django import forms
from django.template import loader
from django.utils.html import format_html
from rest_framework.renderers import BrowsableAPIRenderer


class SeriesQueryForm(forms.Form):
    # Formulário que aparece na tela do DRF (botão "Filters") para o histórico da estação
    metric = forms.ChoiceField(
        label="Métrica",
        choices=[("level", "Nível (m)"), ("rain", "Chuva (mm/h)")],
        widget=forms.Select(attrs={"class": "form-control"}),
    )
    hours = forms.IntegerField(
        label="Horas (de 1 a 72)",
        min_value=1,
        max_value=72,
        widget=forms.NumberInput(attrs={"class": "form-control"}),
    )


class SeriesBrowsableRenderer(BrowsableAPIRenderer):
    # Tela do DRF com um formulário gráfico (métrica e horas) para o endpoint series.
    # O formulário é enviado por GET e monta a URL ?metric=...&hours=... sozinho.
    def get_filter_form(self, data, view, request):
        form = SeriesQueryForm(initial={
            "metric": request.query_params.get("metric", "level"),
            "hours": request.query_params.get("hours", 24),
        })
        html = format_html(
            '<h2>Histórico da estação</h2>'
            '<form class="form" action="" method="get">{}'
            '<button type="submit" class="btn btn-primary">Consultar</button></form>',
            form.as_p(),
        )
        template = loader.get_template(self.filter_template)
        return template.render({"elements": [html]})
