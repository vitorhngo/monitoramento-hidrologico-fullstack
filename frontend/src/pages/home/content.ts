// Conteúdo da página inicial: links, equipe, endpoints e instituições.
// Para trocar o endereço do repositório na página, altere apenas REPO_URL.
export const REPO_URL =
  'https://github.com/vitorhngo/monitoramento-hidrologico-fullstack'

// URL base da API: a mesma variável usada pelos serviços do painel (frontend/.env).
const API_BASE_URL: string =
  import.meta.env.VITE_API_BASE_URL ?? 'http://127.0.0.1:8000'

export const API_LINKS = {
  root: `${API_BASE_URL}/api/`,
  swagger: `${API_BASE_URL}/api/docs/`,
  redoc: `${API_BASE_URL}/api/redoc/`,
}

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

export interface Endpoint {
  method: HttpMethod
  path: string
  description: string
}

export const ENDPOINTS: Endpoint[] = [
  {
    method: 'GET',
    path: '/api/stations',
    description:
      'Lista as estações disponíveis. Aceita filtros por id, name, river e municipality.',
  },
  { method: 'POST', path: '/api/stations', description: 'Cria uma nova estação (requer token).' },
  { method: 'GET', path: '/api/stations/{id}', description: 'Retorna os dados de uma estação.' },
  { method: 'PUT', path: '/api/stations/{id}', description: 'Substitui os dados de uma estação (requer token).' },
  { method: 'PATCH', path: '/api/stations/{id}', description: 'Atualiza parcialmente os dados de uma estação (requer token).' },
  { method: 'DELETE', path: '/api/stations/{id}', description: 'Exclui uma estação (requer token).' },
  {
    method: 'GET',
    path: '/api/stations/{id}/series?metric=level&hours=24',
    description: 'Consulta a série histórica por métrica (level ou rain) e período (1 a 72 horas).',
  },
  { method: 'GET', path: '/api/stations/{id}/summary', description: 'Apresenta as leituras mais recentes de nível e chuva.' },
  { method: 'POST', path: '/api/token/', description: 'Autentica o usuário e retorna um token de acesso.' },
]

export interface TeamMember {
  name: string
  course: string
  photo: string
  linkedin: string
  github: string
}

export const TEAM: TeamMember[] = [
  {
    name: 'Vitor Hugo da Silva Araújo',
    course: 'Análise e Desenvolvimento de Sistemas',
    photo: '/img/profile_picture_vitor.jpg',
    linkedin: 'https://www.linkedin.com/in/vitorsilvadev/',
    github: 'https://github.com/vitorhngo',
  },
  {
    name: 'Renato Moreira Santos Faria',
    course: 'Engenharia de Software',
    photo: '/img/profile_picture_renato.png',
    linkedin: 'https://www.linkedin.com/in/renato-moreira-31a53b379/',
    github: 'https://github.com/renasrenas2',
  },
  {
    name: 'Gustavo Michel Luna Ribeiro',
    course: 'Análise e Desenvolvimento de Sistemas',
    photo: '/img/profile_picture_gustavo.jpg',
    linkedin: 'https://www.linkedin.com/in/gustavo-ribeiro-549463425/',
    github: 'https://github.com/gustavomchel',
  },
]

export interface Institution {
  tag: string
  name: string
  description: string
}

export const INSTITUTIONS: Institution[] = [
  {
    tag: 'Fomento e gestão de recursos',
    name: 'Ministério da Ciência, Tecnologia e Inovação (MCTI)',
    description:
      'Atua como gerenciador do acesso ao fundo de recursos provenientes da Lei da Informática, que estimula investimentos em pesquisa, desenvolvimento e inovação no setor de TIC.',
  },
  {
    tag: 'Instituição proponente e executora',
    name: 'Instituto Hardware Brasil (HBr)',
    description:
      'É a instituição proponente e executora principal do projeto, responsável pela operacionalização do programa, incluindo captação e seleção dos alunos e gestão das bolsas.',
  },
  {
    tag: 'Instituição parceira de ensino',
    name: 'Instituto Federal de Brasília (IFB) · Campus Taguatinga',
    description:
      'Participa como instituição parceira de ensino na oferta presencial, disponibilizando infraestrutura, laboratórios, corpo docente especializado e apoio pedagógico.',
  },
]
