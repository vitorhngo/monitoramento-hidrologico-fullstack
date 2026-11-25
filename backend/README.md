# Backend — Arquitetura e requisitos

API REST do **Monitoramento Hidrológico**, desenvolvida com **Python, Django, Django REST Framework (DRF) e SQLite**. Fornece consultas a estações fictícias e observações sintéticas de nível e chuva.

> **Dados simulados — sem finalidade operacional.** A API não monitora rios reais.

## 1. Origem dos requisitos e adaptação

O **Guia de Desafios da COGMO Technology** originalmente propõe Node.js, Express e SQLite. O documento acadêmico **01 — Desafio COGMO** determina a adaptação para **Python + Django**, um script de seed em Python que exporte `observations.csv` e documentação da API com **drf-spectacular (Swagger/Redoc)**. As funcionalidades abaixo são separadas entre requisitos do desafio e implementações adicionais verificadas na branch `develop`.

## 2. Arquitetura implementada

A aplicação utiliza uma **arquitetura em camadas baseada nos componentes do Django/DRF**. Não se afirma a existência de uma camada independente de serviços: as regras de consulta e validação dos endpoints estão principalmente no `StationViewSet`.

```text
Cliente HTTP / frontend React
           |
           v
setup/urls.py e api/urls.py       # URLs e roteamento DRF
           |
           v
api/views.py                     # StationViewSet, ações summary/series
           |
           +--> api/filters.py   # Filtros de estações
           +--> api/serializers.py # Representação/validação JSON
           |
           v
api/models.py                    # Station e Observation, Django ORM
           |
           v
SQLite (db.sqlite3)

api/scripts/seed.py              # Gera stations.csv e observations.csv
           |
           v
api/data/*.csv
           |
           v
api/management/commands/import_csv.py
           |
           v
Django ORM -> SQLite
```

**Responsabilidades:** `setup/` contém configurações globais e URLs; `api/models.py` define entidades e restrições; `api/views.py` implementa consultas e respostas HTTP; `api/serializers.py` serializa entidades; `api/filters.py` aplica filtros; `api/urls.py` registra o roteador; o seed e o comando de importação cuidam da carga sintética.

## 3. Modelo de dados (MER/DER textual)

```text
STATION (1) ─────────── (N) OBSERVATION

STATION                       OBSERVATION
- id (PK, texto)              - id (PK)
- name                        - station_id (FK -> STATION.id)
- river                       - metric ('level' | 'rain')
- municipality                - observed_at (data/hora)
                              - value (número)
                              - unit ('m' | 'mm/h')
                              - source ('synthetic')
```

**Integridade implementada:** chave estrangeira com exclusão em cascata; unicidade de `(name, river, municipality)` em estações; unicidade de `(station, metric, observed_at)` em observações; restrições para métricas válidas e compatibilidade entre métrica e unidade; índice composto `(station, metric, observed_at)`. Esse diagrama textual resume as entidades, mas **não substitui um DER gráfico**, caso seja exigido na entrega.

## 4. Requisitos funcionais (RF)

A tabela distingue o **contrato da empresa** e os **complementos do código atual**. O status “implementado” se refere à presença da funcionalidade no código consultado, não a uma execução de testes neste levantamento.

| ID | Requisito | Origem | Situação no código |
| --- | --- | --- | --- |
| RF01 | Listar as três estações fictícias por `GET /api/stations` | COGMO | Implementado |
| RF02 | Consultar últimas leituras e identificação da estação por `GET /api/stations/{id}/summary` | COGMO | Implementado |
| RF03 | Consultar série de nível por `metric=level`, em metros | COGMO | Implementado |
| RF04 | Consultar série de chuva por `metric=rain`, em mm/h | COGMO | Implementado |
| RF05 | Filtrar séries por janela de 1 a 72 horas (padrão 24) | COGMO | Implementado |
| RF06 | Validar estação, métrica e janela de consulta; devolver erros HTTP adequados | COGMO | Implementado nas views |
| RF07 | Gerar três estações e observações sintéticas por seed local | COGMO + adaptação | Implementado em Python |
| RF08 | Exportar observações para CSV e importá-las no banco sem duplicação | Adaptação + COGMO | Implementado |
| RF09 | Documentar o contrato da API e como executá-la | COGMO + adaptação | Swagger, Redoc e README |
| RF10 | Consultar estação individual e filtrar listagem | Complemento do projeto | Implementado |
| RF11 | Criar, atualizar e excluir estações com autenticação | Complemento do projeto | Implementado pelo ModelViewSet e permissões DRF |
| RF12 | Emitir token de autenticação para usuário cadastrado | Complemento do projeto | Implementado |

**Observação:** autenticação **não é exigência da proposta original da COGMO**, que explicitamente dispensa credenciais. É uma ampliação de escopo da implementação atual.

## 5. Requisitos não funcionais (RNF)

| ID | Requisito / critério | Base e observação |
| --- | --- | --- |
| RNF01 | Usar Python + Django como stack de backend | Obrigatório pela adaptação acadêmica |
| RNF02 | Persistir dados em banco relacional SQLite, com chaves e integridade | Guia COGMO; constraints e FK presentes nos modelos |
| RNF03 | Tratar horários em UTC, com datas ISO 8601 | Guia COGMO; seed gera `Z`, serializer de pontos utiliza UTC |
| RNF04 | Manter nível em `m` e chuva em `mm/h`, sem misturar unidades | Guia COGMO; restrições nos modelos |
| RNF05 | Não inventar observações em períodos sem dados | Guia COGMO; a consulta retorna somente registros existentes |
| RNF06 | Identificar explicitamente os dados como simulados | Guia COGMO; respostas de resumo e série possuem indicadores; verificar também a apresentação de todas as respostas da API |
| RNF07 | Garantir ordenação cronológica do histórico | Guia COGMO; `order_by('observed_at')` |
| RNF08 | Evitar duplicação ao executar a carga novamente | Guia COGMO; `update_or_create` e constraints |
| RNF09 | Validar entradas e utilizar consultas seguras | Guia COGMO; uso de Django ORM e validação de parâmetros |
| RNF10 | Disponibilizar documentação compreensível e reproduzível | Guia COGMO e adaptação; Swagger/Redoc e instruções locais |
| RNF11 | Proteger credenciais e chave secreta fora do código versionado | Boa prática aplicada por `.env.example` e `django-environ`; conferir `.gitignore` |
| RNF12 | Possibilitar testes automatizados | Boa prática; comando `python manage.py test` disponível; cobertura e aprovação não verificadas aqui |

**Fora do escopo obrigatório:** previsão por IA, integração com sensores reais, alertas de risco, autenticação, deploy, alta disponibilidade e infraestrutura complexa. O projeto atual adicionou autenticação como funcionalidade extra.

## 6. API e regras

Base local: `http://127.0.0.1:8000/api`.

| Método | Rota | Acesso |
| --- | --- | --- |
| GET | `/api/stations` | Público |
| GET | `/api/stations/{id}` | Público |
| GET | `/api/stations/{id}/summary` | Público |
| GET | `/api/stations/{id}/series?metric=level&hours=24` | Público |
| GET | `/api/stations/{id}/series?metric=rain&hours=24` | Público |
| POST | `/api/stations` | Autenticado |
| PUT/PATCH/DELETE | `/api/stations/{id}` | Autenticado |
| POST | `/api/token/` | Credenciais de usuário |

As rotas de estações são configuradas **sem barra final**. O parâmetro `metric` é obrigatório (`level` ou `rain`); `hours` é opcional, inteiro de 1 a 72, com padrão 24. A série retorna `station_id`, `metric`, `unit`, `hours`, `simulated`, `source` e `points`; o resumo retorna `is_simulated`, `station` e `latest_readings`. Respostas esperadas incluem `400` para filtros inválidos, `404` para estação ausente e `401` para operações sem autenticação adequada.

**Integração com o frontend:** o React utiliza os IDs textuais retornados pela API (por exemplo, `EST-01`) e consulta os endpoints públicos de listagem, resumo e série. Não é necessário token para essas consultas.

O `django-cors-headers` está configurado em `setup/settings.py`, com `CorsMiddleware` e `CORS_ALLOWED_ORIGINS` permitindo `http://localhost:5173` e `http://127.0.0.1:5173`. Caso a origem do frontend mude, revise a lista de origens permitidas. O frontend configura `VITE_API_BASE_URL=http://127.0.0.1:8000` em seu próprio `.env`.

### Documentação interativa

- Swagger UI: `http://127.0.0.1:8000/api/docs/`
- Redoc: `http://127.0.0.1:8000/api/redoc/`
- OpenAPI: `http://127.0.0.1:8000/api/schema/`

## 7. Instalação e execução

Pré-requisitos: Python compatível com as dependências fixadas em `requirements.txt` (a documentação anterior indica Python 3.14.6), Git e ambiente virtual. A partir da **raiz do repositório**:

```bash
cd backend
python -m venv .venv
```

Ative o ambiente virtual:

```powershell
# Windows / PowerShell
.\.venv\Scripts\Activate.ps1
```

```bash
# Linux / macOS
source .venv/bin/activate
```

Instale as dependências:

```bash
python -m pip install -r requirements.txt
```

Copie `backend/.env.example` para `backend/.env` (estando em `backend/`, use `.env.example` como origem) e gere uma chave:

```bash
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```

Substitua `replace-with-your-own-secret-key` pelo valor gerado. Para desenvolvimento local, mantenha `DJANGO_DEBUG=True` e `DJANGO_ALLOWED_HOSTS=localhost,127.0.0.1`. **Não versione o `.env`.**

Prepare o banco, gere os CSVs e importe os registros:

```bash
python manage.py migrate
python api/scripts/seed.py
python manage.py import_csv
python manage.py runserver
```

O seed gera `api/data/stations.csv` e `api/data/observations.csv`. Ele utiliza a hora atual em UTC como referência; a importação utiliza `update_or_create` para evitar duplicações das mesmas chaves. A execução em horários diferentes pode gerar novos registros, portanto **idempotência não significa manter sempre a mesma quantidade total de observações**.

Para verificar testes:

```bash
python manage.py test
```

## 8. Autenticação (funcionalidade adicional)

```bash
python manage.py createsuperuser
```

Com o servidor iniciado, solicite o token:

```bash
curl -X POST http://127.0.0.1:8000/api/token/ -d "username=SEU_USUARIO" -d "password=SUA_SENHA"
```

Em operações de escrita, envie `Authorization: Token SEU_TOKEN`. O projeto configura `IsAuthenticatedOrReadOnly`, `TokenAuthentication` e `SessionAuthentication` no DRF.

## 9. Limites e evolução

- A API usa dados fictícios e não deve sustentar decisões hidrológicas reais.
- A janela histórica é calculada relativamente ao horário atual do servidor (`timezone.now()`); o frontend integrado solicita os períodos de 12, 24 ou 48 horas.
- A integração com o frontend está implementada. Recomenda-se validar o fluxo completo no navegador, incluindo CORS, horários, unidades e tratamento de falhas.
- Para a entrega acadêmica, anexar ou criar também um **DER gráfico**, além do modelo textual acima, se solicitado pelo professor.

## Referências

- **01 — Desafio COGMO:** adaptação acadêmica Python + Django e entregáveis.
- **01 — Guia de Desafios COGMO Technology:** contrato HTTP, regras de dados, escopo e avaliação.
- Código da branch [`develop`](https://github.com/vitorhngo/monitoramento-hidrologico-fullstack/tree/develop), especialmente `backend/api/` e `backend/setup/`.
