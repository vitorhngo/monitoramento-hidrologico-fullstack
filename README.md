# Monitoramento Hidrológico

API REST desenvolvida com Django e Django REST Framework para consultar dados sintéticos de monitoramento de nível de rios e intensidade de chuva.

> **Aviso:** os dados são fictícios e possuem finalidade exclusivamente demonstrativa.

## 1. Criação de ambiente

### Pré-requisitos

- Python(3.14.6) instalado.
- Git instalado.

### 1.1. Clonar o repositório

```bash
git clone https://github.com/vitorhngo/monitoramento-hidrologico-fullstack.git
cd monitoramento-hidrologico-fullstack
```

### 1.2. Criar e ativar o ambiente virtual

Windows:

```powershell
python -m venv venv
.\venv\Scripts\activate
```

Linux:

```bash
python3 -m venv venv
source venv/bin/activate
```

## 2. Documentação da API (Swagger e Redoc)

Com o servidor em execução (`python manage.py runserver`), a documentação interativa fica disponível em:

| Interface | URL |
|---|---|
| Swagger UI | `http://127.0.0.1:8000/api/docs/` |
| Redoc | `http://127.0.0.1:8000/api/redoc/` |
| Schema OpenAPI | `http://127.0.0.1:8000/api/schema/` |

No Swagger é possível testar os endpoints diretamente pelo botão **Try it out**.

## 3. Endpoints

Endereço base: `http://127.0.0.1:8000/api`

> **Atenção:** as rotas não usam barra no final (use `/api/stations`, e não `/api/stations/`).

| Método | Rota | Descrição | Autenticação |
|---|---|---|---|
| GET | `/api/stations` | Lista as estações. Aceita os filtros `id`, `name`, `river` e `municipality`. | Não |
| GET | `/api/stations/{id}` | Detalhe de uma estação. | Não |
| GET | `/api/stations/{id}/summary` | Última leitura de nível e de chuva da estação. | Não |
| GET | `/api/stations/{id}/series?metric=level&hours=24` | Histórico de nível (em metros). | Não |
| GET | `/api/stations/{id}/series?metric=rain&hours=24` | Histórico de chuva (em mm/h). | Não |
| POST | `/api/token/` | Gera o token de autenticação (envia `username` e `password`). | Não |
| POST, PUT, PATCH, DELETE | `/api/stations` e `/api/stations/{id}` | Criar, alterar e excluir estações. | Sim (token) |

Parâmetros do histórico (`series`):

- `metric` (obrigatório): `level` (nível, em m) ou `rain` (chuva, em mm/h).
- `hours` (opcional): janela de tempo em horas, de 1 a 72. Padrão: 24.

Exemplos de chamadas:

```bash
curl http://127.0.0.1:8000/api/stations
curl http://127.0.0.1:8000/api/stations?river=verde
curl http://127.0.0.1:8000/api/stations/EST-01/summary
curl "http://127.0.0.1:8000/api/stations/EST-01/series?metric=level&hours=24"
```

Respostas de erro:

- `400`: `metric` ou `hours` inválidos.
- `401`: tentativa de criar, alterar ou excluir sem token.
- `404`: estação não encontrada.

> **Aviso:** todos os dados são sintéticos e não descrevem rios reais.

