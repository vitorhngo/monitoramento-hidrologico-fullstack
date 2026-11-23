## 1. Instalar as dependências

Antes de executar comandos ou rodar o projeto, certifique-se de que o Python do ambiente virtual (venv) esteja ativo.

1. Pressione Ctrl + Shift + P para abrir a paleta de comandos.
2. Digite e selecione Python: Select Interpreter.
3. Escolha a opção que contém o caminho da pasta da sua venv (ex: .\venv\Scripts\python.exe).

```bash
cd backend
python -m pip install -r requirements.txt
```

> **Aviso:** O início `python -m pip` garante que o pip seja vinculado exatamente ao Python da sua venv atual, evitando instalações acidentais no sistema global e conflitos futuros de sistema. 

### 1.2. Criar variáveis de ambiente
1. Copie o arquivo `.env.example`, colocando-o na raiz do diretório backend.
2. Renomeie-o para `.env`
3. No terminal, rode o comando abaixo:

```bash
python -c 'from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())'
```
4. Copie o código que aparece. No arquivo `.env`, substitua *replace-with-your-own-secret-key* pelo código copiado.

## 2. Preparar o banco de dados

```bash
python manage.py makemigrations
python manage.py migrate
```

### 2.1. Gerar e importar os dados

```bash
python api/scripts/seed.py
python manage.py import_csv
```

O `seed.py` gera os dados sintéticos em CSV, enquanto o `import_csv` importa os registros para o banco SQLite.

## 3. Executar a aplicação

```bash
python manage.py runserver
```

A aplicação ficará disponível em:

`http://127.0.0.1:8000/`

## 4. Executar os testes

Com o ambiente virtual ativo, na raiz do projeto:

```bash
python manage.py test
```

O resultado esperado termina com `OK`.

## 5. Criar superusuário e obter token

### 5.1. Criar o superusuário

```bash
python manage.py createsuperuser
```

Informe o nome de usuário, o e-mail (opcional) e a senha quando solicitado. Depois, com o servidor em execução, o painel administrativo fica em `http://127.0.0.1:8000/admin/`.

## 6. Obter o token de autenticação

Com o servidor em execução, envie o usuário e a senha para `/api/token/`:

```bash
curl -X POST http://127.0.0.1:8000/api/token/ -d "username=seu_usuario" -d "password=sua_senha"
```

> No PowerShell do Windows, use `curl.exe` no lugar de `curl`.

A resposta traz o token:

```json
{"token": "seu_token_aqui"}
```

### 6.1. Usar o token

- **Em requisições:** envie o cabeçalho `Authorization: Token seu_token_aqui`.
- **No Swagger:** clique em **Authorize**, preencha o campo `tokenAuth` com `Token seu_token_aqui` e confirme.

Exemplo de requisição autenticada:

```bash
curl -X DELETE http://127.0.0.1:8000/api/stations/EST-99 -H "Authorization: Token seu_token_aqui"
```
