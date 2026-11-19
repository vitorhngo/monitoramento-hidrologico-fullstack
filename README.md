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
cd monitoramento-hidrologico
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

### 1.3. Instalar as dependências

Antes de executar comandos ou rodar o projeto, certifique-se de que o Python do ambiente virtual (venv) esteja ativo.

1. Pressione Ctrl + Shift + P para abrir a paleta de comandos.
2. Digite e selecione Python: Select Interpreter.
3. Escolha a opção que contém o caminho da pasta da sua venv (ex: .\venv\Scripts\python.exe).

```bash
python -m pip install -r requirements.txt
```

> **Aviso:** O início `python -m pip` garante que o pip seja vinculado exatamente ao Python da sua venv atual, evitando instalações acidentais no sistema global e conflitos futuros de sistema. 

### 1.4. Criar variáveis de ambiente
1. Copie o arquivo `.env.example`, colocando-o na raiz do projeto.
2. Renomeie-o para `.env`
3. No terminal, rode o comando abaixo:

```bash
python -c 'from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())'
```
4. Copie o código que aparece. No arquivo `.env`, substitua *replace-with-your-own-secret-key* pelo código copiado.

## 2. Preparar o banco de dados

```bash
python manage.py makemigrations # Apenas uma vez
python manage.py migrate
```

### 2.1. Gerar e importar os dados

```bash
python3 api/scripts/seed.py
python manage.py import_csv
```

O `seed.py` gera os dados sintéticos em CSV, enquanto o `import_csv` importa os registros para o banco SQLite.

## 3. Executar a aplicação

```bash
python manage.py runserver
```

A aplicação ficará disponível em:

`http://127.0.0.1:8000/`

## 4. Documentação da API (Swagger e Redoc)

Com o servidor em execução (`python manage.py runserver`), a documentação interativa fica disponível em:

| Interface | URL |
|---|---|
| Swagger UI | `http://127.0.0.1:8000/api/docs/` |
| Redoc | `http://127.0.0.1:8000/api/redoc/` |
| Schema OpenAPI | `http://127.0.0.1:8000/api/schema/` |

No Swagger é possível testar os endpoints diretamente pelo botão **Try it out**.

## 5. Endpoints

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

## 6. Executar os testes

Com o ambiente virtual ativo, na raiz do projeto:

```bash
python manage.py test
```

O resultado esperado termina com `OK`.

## 7. Criar superusuário e obter token

### 7.1. Criar o superusuário

```bash
python manage.py createsuperuser
```

Informe o nome de usuário, o e-mail (opcional) e a senha quando solicitado. Depois, com o servidor em execução, o painel administrativo fica em `http://127.0.0.1:8000/admin/`.

### 7.2. Obter o token de autenticação

Com o servidor em execução, envie o usuário e a senha para `/api/token/`:

```bash
curl -X POST http://127.0.0.1:8000/api/token/ -d "username=seu_usuario" -d "password=sua_senha"
```

> No PowerShell do Windows, use `curl.exe` no lugar de `curl`.

A resposta traz o token:

```json
{"token": "seu_token_aqui"}
```

### 7.3. Usar o token

- **Em requisições:** envie o cabeçalho `Authorization: Token seu_token_aqui`.
- **No Swagger:** clique em **Authorize**, preencha o campo `tokenAuth` com `Token seu_token_aqui` e confirme.

Exemplo de requisição autenticada:

```bash
curl -X DELETE http://127.0.0.1:8000/api/stations/EST-99 -H "Authorization: Token seu_token_aqui"
```
