# Monitoramento Hidrológico

Sistema didático fullstack para consulta e visualização de **dados sintéticos** de nível de rios e precipitação em três estações fictícias. O projeto reúne uma API REST em **Python + Django** e uma interface em **React + TypeScript**, conforme o desafio da COGMO Technology adaptado para o curso.

> **Dados simulados — sem finalidade operacional.** As medições não representam rios reais e não devem ser utilizadas para alertas ou decisões.

## Objetivo e escopo

Permitir a seleção de uma estação, a consulta de suas últimas medições e a exploração de históricos de nível (`m`) e chuva (`mm/h`). Os horários das observações são tratados em UTC. O desafio não exige sensores reais, previsão por IA, alertas de risco, deploy ou alta disponibilidade.

## Tecnologias

| Camada | Tecnologias |
| --- | --- |
| Backend | Python, Django 6.1.2, Django REST Framework 3.18.3, SQLite, django-filter, django-cors-headers |
| Documentação da API | drf-spectacular, Swagger UI e Redoc |
| Frontend | React 19, TypeScript 6, Vite 8, Recharts 3 |
| Dados de demonstração | Script Python, CSV e importação pelo Django ORM |

## Organização

```text
monitoramento-hidrologico-fullstack/
├── README.md                 # Visão geral
├── backend/
│   ├── README.md             # Arquitetura, requisitos e execução da API
│   ├── manage.py
│   ├── requirements.txt
│   ├── .env.example
│   ├── setup/                # Configuração e URLs do Django
│   └── api/                  # Modelos, rotas, views, seed e importação
└── frontend/
    ├── README.md             # Interface e instruções de execução
    ├── package.json
    └── src/                  # Componentes, serviços HTTP e tipos
```

## Situação das partes

- **Backend:** API Django implementada para estações, resumos e séries históricas; inclui CRUD de estações protegido por autenticação nas operações de escrita.
- **Frontend:** interface que consulta estações, resumos e históricos pela API, com estados de carregamento, erro e histórico vazio.
- **Integração:** implementada na branch `develop` por serviços HTTP com `fetch`, URL configurável e CORS no Django.

## Começar

```bash
git clone --branch develop https://github.com/vitorhngo/monitoramento-hidrologico-fullstack.git
cd monitoramento-hidrologico-fullstack
```

### Backend

Crie e ative um ambiente virtual Python, instale as dependências e prepare o arquivo `backend/.env` a partir de `backend/.env.example`. Execute os comandos abaixo **dentro de `backend/`**, com o ambiente ativo:

```bash
python -m pip install -r requirements.txt
python manage.py migrate
python api/scripts/seed.py
python manage.py import_csv
python manage.py runserver
```

O arquivo `.env` deve conter `DJANGO_SECRET_KEY` configurada. Consulte [backend/README.md](backend/README.md) para instruções completas, inclusive criação da chave e autenticação.

API local: `http://127.0.0.1:8000/api/`  
Swagger: `http://127.0.0.1:8000/api/docs/`  
Redoc: `http://127.0.0.1:8000/api/redoc/`

### Frontend

Em outro terminal, a partir da raiz:

```bash
cd frontend
npm ci
```

Copie `frontend/.env.example` para `frontend/.env` e mantenha `VITE_API_BASE_URL=http://127.0.0.1:8000`. Com o backend em execução, rode:

```bash
npm run dev
```

Abra a URL informada pelo Vite (normalmente `http://localhost:5173/`). Mantenha os dois servidores em execução. O Django autoriza via CORS as origens `http://localhost:5173` e `http://127.0.0.1:5173`; se a porta mudar, ajuste a configuração ou libere a porta 5173. Consulte [frontend/README.md](frontend/README.md).

## Contrato principal da API

| Método | Rota | Finalidade |
| --- | --- | --- |
| GET | `/api/stations` | Listar estações |
| GET | `/api/stations/{id}` | Consultar uma estação |
| GET | `/api/stations/{id}/summary` | Últimas leituras de nível e chuva |
| GET | `/api/stations/{id}/series?metric=level&hours=24` | Série histórica de nível |
| GET | `/api/stations/{id}/series?metric=rain&hours=24` | Série histórica de chuva |

A série aceita `hours` entre 1 e 72, com padrão 24. As rotas de estações não possuem barra final. O backend também disponibiliza operações de escrita autenticadas e emissão de token.

## Documentação e referências

- [Arquitetura e requisitos do backend](backend/README.md)
- [Interface e funcionamento do frontend](frontend/README.md)
- **COGMO Technology — Guia de Desafios:** contrato, escopo, critérios de avaliação e requisitos de cada trilha.
- **01 — Desafio COGMO (adaptação acadêmica):** substituição de Node.js/Express por Python + Django, geração de CSV por script Python e documentação com drf-spectacular.

## Integração e validação

O frontend consulta os endpoints públicos de estações, resumo e série histórica, usando IDs textuais como `EST-01`. A API retorna dados sintéticos persistidos no SQLite. A janela histórica é relativa ao horário atual do servidor.

Como próximos passos, validar a integração no navegador, incluindo erros, lacunas, unidades e UTC, e garantir que a interface identifique explicitamente os dados como simulados.
