# Monitoramento Hidrológico — Frontend

Interface web do projeto **Monitoramento Hidrológico**, desenvolvida com **React, TypeScript e Vite**. Permite consultar estações hidrológicas fictícias, visualizar as leituras mais recentes de nível do rio e precipitação e explorar gráficos históricos.

> **Atenção:** esta versão utiliza **dados simulados (mock)**, sem finalidade operacional. **Ainda não está integrada à API Python + Django.** Não utilize os valores para monitoramento ou decisões reais.

## Funcionalidades disponíveis

- Seleção entre três estações fictícias, com identificação do rio e município.
- Cartões com a última leitura de **nível do rio (m)** e **precipitação (mm/h)**, incluindo o horário em **UTC**.
- Gráfico de linha para nível e gráfico de barras para precipitação, usando **Recharts**.
- Filtros de histórico de **12, 24 e 48 horas**.
- Tratamento visual de medições ausentes, sem preenchimento artificial das lacunas.
- Cenários de demonstração: **normal**, **carregamento**, **erro com botão de nova tentativa** e **histórico vazio**.
- Interface responsiva para desktop e celular e controles acessíveis pelo teclado.

## Pré-requisitos

- **Node.js** e **npm** instalados. Recomenda-se utilizar uma versão **LTS do Node.js** compatível com as dependências do projeto.
- **Git** instalado para obter ou atualizar o repositório.
- Um navegador moderno (Chrome, Edge ou Firefox, por exemplo).

Confira a instalação no terminal:

```powershell
node -v
npm.cmd -v
```

> No **PowerShell do Windows**, pode ser necessário usar `npm.cmd` no lugar de `npm`, caso a política de execução bloqueie o arquivo `npm.ps1`. Os comandos a seguir usam `npm.cmd`. No macOS/Linux, use `npm`.

## Instalação

### 1. Obter o repositório

Se ainda não tiver o projeto no computador:

```powershell
git clone https://github.com/vitorhngo/monitoramento-hidrologico-fullstack.git
cd monitoramento-hidrologico-fullstack
```

Se já tiver clonado o projeto, entre na pasta local do repositório e atualize a branch utilizada pela equipe. **Caso a equipe esteja trabalhando diretamente na `main` e você não tenha alterações locais pendentes**, execute:

```powershell
git pull origin main
```

### 2. Entrar na pasta do frontend

A partir da raiz do repositório:

```powershell
cd front
```

### 3. Instalar as dependências

```powershell
npm.cmd ci
```

O comando `npm.cmd ci` usa o arquivo `package-lock.json` para instalar as versões registradas pela equipe. Se o lockfile estiver ausente ou inconsistente, verifique com a equipe antes de substituí-lo; `npm.cmd install` pode atualizar o lockfile.

> **Não é necessário executar `npm create vite` novamente.** A aplicação React já está criada na pasta `front/`.

## Executar localmente

Dentro da pasta `front/`, execute:

```powershell
npm.cmd run dev
```

Abra no navegador o endereço exibido no terminal, geralmente:

```text
http://localhost:5173/
```

Se a porta `5173` estiver ocupada, o Vite poderá usar outra, como `http://localhost:5174/`. Utilize **sempre a URL mostrada no terminal**.

Para parar o servidor, pressione **Ctrl + C** no terminal onde ele está em execução.

**O backend Django não precisa estar em execução para esta versão com dados simulados.**

## Como testar as funcionalidades

1. **Estações:** selecione cada estação e verifique a mudança do nome, rio, município, resumo e histórico.
2. **Resumo:** confira o nível em `m`, a precipitação em `mm/h` e os horários em `UTC`. Uma leitura igual a `0` deve aparecer normalmente; uma leitura ausente deve aparecer como indisponível.
3. **Gráficos:** alterne entre **Nível do rio** (linha) e **Precipitação** (barras).
4. **Períodos:** teste os filtros **12 h**, **24 h** e **48 h**.
5. **Cenário normal:** escolha **Normal** no campo *Cenário de demonstração*. O texto *Carregando histórico...* deve aparecer brevemente antes do gráfico.
6. **Erro:** escolha **Erro simulado**. Confirme a mensagem de falha e o botão **Tentar novamente**. A tentativa será refeita, mas **continuará falhando enquanto o cenário de erro estiver selecionado**.
7. **Histórico vazio:** escolha **Histórico vazio**. A aplicação deve mostrar uma mensagem de ausência de medições, sem inventar valores.
8. **Recuperação:** retorne ao cenário **Normal** e verifique que o gráfico reaparece.
9. **Responsividade e teclado:** teste a visualização em uma largura de aproximadamente **375 px** e navegue pelos controles com `Tab`, `Enter`, `Espaço` e setas, conforme o tipo de controle.

> Os horários e valores do mock são **fixos para demonstração**. Eles não representam medições atuais nem uma série relativa ao horário real do computador.

## Compilar para produção

```powershell
npm.cmd run build
```

O Vite gera os arquivos na pasta `front/dist/`. Uma mensagem como **`built in ...`** indica que a compilação terminou. Avisos sobre arquivos JavaScript maiores que 500 kB são recomendações de otimização, **não erros de compilação**.

Para testar localmente a versão compilada:

```powershell
npm.cmd run preview
```

Abra a URL informada no terminal. O comando `preview` não substitui uma configuração adequada de hospedagem de produção.

## Organização principal

```text
front/
├── public/                    # Arquivos estáticos
├── src/
│   ├── components/
│   │   ├── HistoryChart.tsx   # Gráficos históricos
│   │   └── MeasurementCard.tsx # Cartão de leitura
│   ├── data/
│   │   ├── series.ts          # Séries históricas simuladas
│   │   ├── stations.ts        # Estações fictícias
│   │   └── summaries.ts       # Últimas leituras simuladas
│   ├── services/
│   │   └── historyService.ts  # Consulta simulada e cenários de teste
│   ├── types/
│   │   ├── series.ts
│   │   ├── station.ts
│   │   └── summary.ts
│   ├── App.tsx                 # Página principal
│   ├── App.css                 # Estilos do painel
│   ├── index.css               # Estilos globais
│   └── main.tsx                # Inicialização do React
├── package.json               # Scripts e dependências
├── package-lock.json          # Versões travadas das dependências
└── vite.config.ts
```

## Problemas comuns

| Sintoma | O que verificar |
| --- | --- |
| `node` não é reconhecido | Instale o Node.js e reabra o VS Code e o terminal; confira `node -v`. |
| `npm.ps1` bloqueado no PowerShell | Use `npm.cmd` em vez de `npm`. Não é necessário desabilitar a política de segurança. |
| `Port 5173 is in use` | Não é necessariamente um erro; abra a nova URL indicada pelo Vite. |
| Módulos não encontrados | Dentro de `front/`, execute `npm.cmd ci` e tente novamente. |
| Página sem estilos | Confirme a existência e as importações de `src/App.css` e `src/index.css`; atualize o navegador com `Ctrl + Shift + R`. |
| Gráfico não aparece | Verifique o cenário de demonstração selecionado e mensagens no console do navegador. |

## Repositório e trabalho em equipe

Repositório: https://github.com/vitorhngo/monitoramento-hidrologico-fullstack

- Versione os arquivos de código, `package.json` e `package-lock.json`.
- **Não envie** `node_modules/` nem `dist/` ao GitHub. Confirme as regras de `.gitignore`.
- Combine com a equipe a branch de trabalho e o fluxo de revisão antes de enviar alterações.
- O projeto existente em Python + Django continua no repositório; há um plano futuro de reorganizar seus arquivos na pasta `backend/`, mas essa mudança não é necessária para executar o frontend atual.

## Próxima etapa

Integrar a interface à **API REST Python + Django**, verificando os contratos reais de resposta, formatos de data, unidades, tratamento de erros e CORS. Até essa integração, o frontend opera exclusivamente no modo simulado.
