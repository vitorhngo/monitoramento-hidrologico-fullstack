# Frontend — Monitoramento Hidrológico

Interface web desenvolvida com **React, TypeScript, Vite e Recharts** para explorar estações hidrológicas fictícias, últimas leituras e históricos de nível de rios e chuva.

> **Estado atual:** o frontend está **integrado à API REST Django** e consulta dados sintéticos persistidos no SQLite. Os dados são fictícios, não correspondem a medições atuais e não possuem finalidade operacional.

## 1. Objetivo e escopo COGMO

O Guia de Desafios COGMO solicita uma página que permita selecionar uma estação, identificar rio e município, mostrar últimas leituras e consultar gráficos históricos de nível e chuva. A interface deve tratar estados de carregamento, erro e vazio, ser responsiva e permitir uso por teclado. A integração com o backend é **opcional na proposta original**, e está implementada neste projeto fullstack.

## 2. Tecnologias

- **React 19:** componentes e estado da interface.
- **TypeScript 6:** tipos de estação, resumo, métrica e observações.
- **Vite 8:** servidor de desenvolvimento e compilação.
- **Recharts 3:** gráficos de nível (linha) e precipitação (barras).
- **CSS:** estilos e layout responsivo.

Versões de dependências conforme `frontend/package.json` na branch `develop`; versões efetivamente instaladas seguem o lockfile.

## 3. Organização e arquitetura

```text
frontend/
├── public/                     # Arquivos estáticos
├── src/
│   ├── components/
│   │   ├── HistoryChart.tsx    # Visualização histórica
│   │   └── MeasurementCard.tsx # Cartões das últimas leituras
│   ├── services/
│   │   ├── api.ts              # Cliente HTTP com fetch
│   │   ├── stationService.ts   # Consulta de estações
│   │   ├── summaryService.ts   # Consulta de resumo
│   │   └── seriesService.ts    # Consulta de histórico
│   ├── types/                  # Tipos de estação, resumo e série
│   ├── App.tsx                 # Estado e composição da página
│   ├── App.css                 # Estilos da página
│   ├── index.css               # Estilos globais
│   └── main.tsx                # Inicialização
├── .env.example               # URL base da API
├── package.json
├── package-lock.json
└── vite.config.ts
```

### Fluxo atual de dados

```text
SQLite -> Django REST API -> api.ts (fetch)
                               |
                               +--> stationService -> App.tsx -> seletor
                               +--> summaryService -> App.tsx -> MeasurementCard
                               +--> seriesService  -> App.tsx -> HistoryChart
```

O `App.tsx` utiliza `useState` e três efeitos: consulta estações na inicialização, consulta o resumo quando a estação muda e consulta o histórico quando estação, métrica, período ou tentativa mudam. A primeira estação retornada é selecionada automaticamente. A lógica de cancelamento ignora respostas antigas. O gráfico recebe `points` da resposta da série.

## 4. Requisitos funcionais da interface

| ID | Requisito do guia | Situação no frontend consultado |
| --- | --- | --- |
| RF-F01 | Selecionar estação e identificar rio e município | Implementado |
| RF-F02 | Mostrar últimas leituras, unidades e horários | Implementado via API |
| RF-F03 | Alternar histórico de nível e chuva, em gráficos separados | Implementado |
| RF-F04 | Selecionar histórico de 12, 24 ou 48 horas | Implementado |
| RF-F05 | Exibir carregamento | Implementado |
| RF-F06 | Exibir erro e opção de nova tentativa | Implementado para histórico; estações e resumo exibem erros sem botão de nova tentativa |
| RF-F07 | Informar quando o histórico estiver vazio | Implementado |
| RF-F08 | Identificar dados simulados e horários/unidades | Parcial: horários e unidades indicados; aviso explícito de simulação precisa ser restaurado |
| RF-F09 | Funcionar em dispositivos móveis e desktop e com teclado | Estrutura implementada; validação manual recomendada |

### Requisitos de qualidade e experiência

- **Legibilidade:** rótulos e unidades visíveis; nível em `m` e precipitação em `mm/h`.
- **Acessibilidade:** controles HTML interativos, rótulos e indicadores de estado; conferir navegação real por teclado e leitores de tela.
- **Responsividade:** testar desktop e largura móvel (por exemplo, 375 px).
- **Confiabilidade visual:** mostrar ausência de medições sem inventar valores; distinguir zero de dado ausente.
- **Transparência:** indicar expressamente que a amostra é simulada e que os horários são UTC.
- **Recuperação de falhas:** disponibilizar botão de nova tentativa em caso de falha na consulta do histórico.

Esses itens derivam do guia e da interface consultada; não representam uma auditoria de acessibilidade ou testes automatizados executados nesta análise.

## 5. Estados e demonstração

| Cenário | Comportamento esperado |
| --- | --- |
| Normal | Exibe estações, resumo e gráfico recebidos da API |
| Carregamento | Mostra mensagens durante as consultas |
| Erro | Exibe falha; o histórico oferece “Tentar novamente” |
| Histórico vazio | Informa ausência de medições, sem fabricar pontos |

Os estados decorrem das requisições HTTP; o seletor de cenários simulados não está presente no `App.tsx` atual. O período é relativo ao horário do servidor Django.

## 6. Instalação

Pré-requisitos: Node.js e npm compatíveis com o projeto, Git e navegador moderno. Recomenda-se Node.js LTS que satisfaça os requisitos das dependências instaladas.

```bash
git clone --branch develop https://github.com/vitorhngo/monitoramento-hidrologico-fullstack.git
cd monitoramento-hidrologico-fullstack/frontend
npm ci
```

Copie `.env.example` para `.env` dentro de `frontend/` e configure:

```dotenv
VITE_API_BASE_URL=http://127.0.0.1:8000
```

Prepare e inicie o backend conforme [backend/README.md](../backend/README.md). Em outro terminal, dentro de `frontend/`:

```bash
npm run dev
```

Abra a URL apresentada no terminal (geralmente `http://localhost:5173/`). Se a porta estiver ocupada, o Vite poderá informar outra. O backend deve permanecer em execução. Se o Vite mudar de porta, ajuste as origens CORS no Django ou utilize a porta 5173.

No PowerShell, se `npm.ps1` for bloqueado, utilize `npm.cmd ci` e `npm.cmd run dev` em vez de modificar a política de execução.

### Comandos úteis

| Comando | Finalidade |
| --- | --- |
| `npm run dev` | Servidor local com atualização automática |
| `npm run build` | Verificação TypeScript e build de produção |
| `npm run preview` | Prévia local do build |
| `npm run lint` | Análise estática com ESLint |

## 7. Roteiro de validação manual

1. Selecionar cada uma das três estações e verificar nome, rio, município e cartões.
2. Alternar `Nível do rio` e `Precipitação` e conferir os tipos de gráfico e as unidades.
3. Testar períodos de 12, 24 e 48 horas.
4. Observar o estado de carregamento durante uma consulta HTTP.
5. Com a página carregada, interromper o backend e alterar o período; verificar o erro do histórico, reiniciar o backend e acionar “Tentar novamente”.
6. Em um banco de teste com estação sem observações no período, verificar a mensagem de histórico vazio e a ausência de pontos artificiais.
7. Verificar horários UTC, valores iguais a zero e ausência de dados.
8. Testar largura móvel e navegação com `Tab`, `Enter`, `Espaço` e setas quando aplicável.

## 8. Integração com Django

A proposta COGMO define o seguinte contrato principal:

| Rota | Uso na interface |
| --- | --- |
| `GET /api/stations` | Alimentar o seletor de estações |
| `GET /api/stations/{id}/summary` | Alimentar os cartões |
| `GET /api/stations/{id}/series?metric=level&hours=24` | Alimentar o gráfico de nível |
| `GET /api/stations/{id}/series?metric=rain&hours=24` | Alimentar o gráfico de chuva |

O cliente `apiFetch<T>` em `services/api.ts` concatena `VITE_API_BASE_URL` ao endpoint, executa `fetch`, verifica `response.ok` e converte a resposta JSON. Os serviços de estação, resumo e série são utilizados pelo `App.tsx`. Os identificadores são textuais, como `EST-01`; os cartões usam `latest_readings` e o gráfico usa `points`. As consultas são públicas e não exigem token.

O backend permite via CORS as origens `http://localhost:5173` e `http://127.0.0.1:5173`. A configuração implementada usa `VITE_API_BASE_URL`, não a convenção `VITE_API_MODE=real` do starter citado no guia.

## 9. Limitações

Não há ingestão de sensores reais, alertas ou previsões. O rodapé atual informa que os dados vêm da API, mas não explicita que são simulados; recomenda-se restaurar esse aviso para atender ao guia COGMO. A tela é uma demonstração educacional, não uma plataforma de monitoramento operacional.

## Referências

- **01 — Guia de Desafios COGMO Technology**, trilha frontend e integração.
- **01 — Desafio COGMO**, adaptação acadêmica da solução backend para Python + Django.
- Código da branch [`develop`](https://github.com/vitorhngo/monitoramento-hidrologico-fullstack/tree/develop), especialmente `frontend/src/App.tsx` e `frontend/package.json`.
