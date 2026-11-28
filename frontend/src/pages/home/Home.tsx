import { useEffect } from 'react'
import { Link } from 'react-router-dom'

import {
  API_LINKS,
  ENDPOINTS,
  INSTITUTIONS,
  REPO_URL,
  TEAM,
} from './content'
import { GitHubIcon, LinkedInIcon } from './SocialIcons'

import './Home.css'

// Abre links externos em nova aba sem expor a página de origem.
const externalLink = { target: '_blank', rel: 'noopener noreferrer' } as const

// Nome "dono/repositório" exibido no cartão do repositório, derivado de REPO_URL.
const repoName = REPO_URL.replace('https://github.com/', '')

function Home() {
  useEffect(() => {
    document.title = 'Monitoramento Hidrológico | Projeto Integrador'
  }, [])

  return (
    <div className="home">
      <header className="topbar">
        <nav className="container nav" aria-label="Navegação principal">
          <Link className="brand" to="/">
            <span className="brand-mark" aria-hidden="true">≈</span>
            <span>Monitoramento Hidrológico</span>
          </Link>

          <div className="nav-links">
            <a href="#projeto">Projeto</a>
            <a href="#api">API</a>
            <a href="#equipe">Equipe</a>
            <a href="#instituicoes">Instituições</a>
            <Link className="nav-cta" to="/painel">Painel</Link>
          </div>
        </nav>
      </header>

      <main>
        <section className="hero" aria-labelledby="hero-titulo">
          <div className="container hero-grid">
            <div>
              <span className="eyebrow">Projeto Integrador · Python + Django + React</span>
              <h1 id="hero-titulo">Informação para compreender o comportamento da água.</h1>
              <p>
                Uma aplicação acadêmica que disponibiliza dados hidrológicos simulados por meio de
                uma API REST e de um painel em React, organizando informações de estações, níveis
                de rios e intensidade de chuva.
              </p>
              <div className="actions">
                <Link className="button button-light" to="/painel">Abrir o painel</Link>
                <a className="button button-outline" href={API_LINKS.swagger} {...externalLink}>
                  Documentação da API
                </a>
                <a className="button button-outline" href="#projeto">Conhecer o projeto</a>
              </div>
            </div>

            <div className="hero-art" aria-hidden="true">
              <div className="water-card">
                <div className="water-icon">
                  <img src="/img/emoji-wave.svg" alt="" />
                </div>
                <strong>Monitoramento hidrológico</strong>
                <span>Estações · Séries históricas · Dados simulados</span>
              </div>
            </div>
          </div>
        </section>

        <section id="projeto" aria-labelledby="projeto-titulo">
          <div className="container">
            <div className="section-head">
              <span className="kicker">O projeto</span>
              <h2 id="projeto-titulo">
                Uma solução de demonstração para um desafio real de desenvolvimento.
              </h2>
              <p>
                O desafio proposto pela COGMO foi adaptado para Python + Django, com uma interface
                em React. A aplicação representa estações hidrológicas fictícias e disponibiliza
                observações sintéticas, permitindo exercitar modelagem de dados, persistência,
                desenvolvimento de serviços REST, documentação de API e integração com um frontend.
              </p>
            </div>

            <div className="feature-grid">
              <article className="feature">
                <div className="feature-icon"><img src="/img/emoji-location.svg" alt="" /></div>
                <h3>Estações</h3>
                <p>Cadastro lógico de estações com identificação, nome, rio e município.</p>
              </article>
              <article className="feature">
                <div className="feature-icon"><img src="/img/emoji-chart.svg" alt="" /></div>
                <h3>Séries históricas</h3>
                <p>
                  Consulta de observações de nível da água (m) e intensidade de chuva (mm/h), com
                  janela de tempo configurável.
                </p>
              </article>
              <article className="feature">
                <div className="feature-icon"><img src="/img/emoji-lab.svg" alt="" /></div>
                <h3>Dados sintéticos</h3>
                <p>
                  Dados gerados para demonstração e testes, sem representar medições de rios reais.
                </p>
              </article>
            </div>
          </div>
        </section>

        <section className="repository-section" id="repositorio" aria-labelledby="repositorio-titulo">
          <div className="container">
            <div className="repository-card">
              <div>
                <span className="kicker">Código-fonte</span>
                <h2 id="repositorio-titulo">Acesse o repositório do projeto</h2>
                <p>
                  Consulte o código-fonte, acompanhe as alterações e conheça a evolução do
                  desenvolvimento. Repositório: <code>{repoName}</code>
                </p>
              </div>
              <a className="button repository-link" href={REPO_URL} {...externalLink}>
                Ver repositório no GitHub
              </a>
            </div>
          </div>
        </section>

        <section className="api-section" id="api" aria-labelledby="api-titulo">
          <div className="container">
            <div className="section-head">
              <span className="kicker">API REST</span>
              <h2 id="api-titulo">A API conecta os dados à aplicação.</h2>
              <p>
                A API é a camada que permite consultar estações e suas observações de forma
                estruturada. Ela separa o acesso aos dados das regras de apresentação e pode ser
                consumida por interfaces ou outras aplicações. Esta página é a porta de entrada do
                sistema: o painel consome a API e a documentação interativa é oferecida pelo
                drf-spectacular.
              </p>
            </div>

            <div className="api-layout">
              <div>
                <h3>O que pode ser consultado?</h3>
                <p className="muted">
                  Os recursos abaixo são disponibilizados pela API sob o prefixo <code>/api/</code>.
                </p>
                <div className="endpoint-list">
                  {ENDPOINTS.map((endpoint) => (
                    <div className="endpoint" key={`${endpoint.method}-${endpoint.path}`}>
                      <span className={`method method-${endpoint.method.toLowerCase()}`}>
                        {endpoint.method}
                      </span>
                      <code>{endpoint.path}</code>
                      <br />
                      <span className="muted">{endpoint.description}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3>Documentação e ferramentas</h3>
                <p className="muted">
                  Use a documentação interativa para visualizar parâmetros, testar requisições e
                  entender as respostas sem precisar montar manualmente cada URL de endpoint. Os
                  links de API, Swagger e Redoc exigem o backend em execução.
                </p>
                <div className="actions">
                  <Link className="button commom-button" to="/painel">Abrir o painel</Link>
                  <a className="button commom-button" href={API_LINKS.root} {...externalLink}>Acessar API</a>
                  <a className="button commom-button" href={API_LINKS.swagger} {...externalLink}>Acessar Swagger UI</a>
                  <a className="button commom-button" href={API_LINKS.redoc} {...externalLink}>Acessar Redoc</a>
                </div>
                <div className="note">
                  <strong>Importante:</strong> as estações e observações deste projeto são
                  fictícias. Os resultados servem para fins didáticos e não devem ser utilizados
                  como informação hidrológica operacional.
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="equipe" aria-labelledby="equipe-titulo">
          <div className="container">
            <div className="section-head">
              <span className="kicker">Quem desenvolve</span>
              <h2 id="equipe-titulo">Equipe do projeto</h2>
              <p>
                Projeto Integrador desenvolvido em equipe no contexto da formação em tecnologia.
              </p>
            </div>

            <div className="team-grid">
              {TEAM.map((member) => (
                <article className="person" key={member.name}>
                  <div className="avatar">
                    <img src={member.photo} alt={`Foto de ${member.name}`} />
                  </div>
                  <h3>{member.name}</h3>
                  <p>{member.course}</p>
                  <div className="person-social">
                    <a
                      className="social-link"
                      href={member.linkedin}
                      aria-label={`LinkedIn de ${member.name}`}
                      title="LinkedIn"
                      {...externalLink}
                    >
                      <LinkedInIcon />
                    </a>
                    <a
                      className="social-link"
                      href={member.github}
                      aria-label={`GitHub de ${member.name}`}
                      title="GitHub"
                      {...externalLink}
                    >
                      <GitHubIcon />
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="institutions" id="instituicoes" aria-labelledby="instituicoes-titulo">
          <div className="container">
            <div className="section-head">
              <span className="kicker">Programa Bolsa Futuro Digital · Ciclo 2</span>
              <h2 id="instituicoes-titulo">Instituições participantes</h2>
              <p>
                O programa articula instituições com responsabilidades complementares na gestão,
                execução e oferta de ensino.
              </p>
            </div>

            <div className="institution-grid">
              {INSTITUTIONS.map((institution) => (
                <article className="institution" key={institution.name}>
                  <span className="tag">{institution.tag}</span>
                  <h3>{institution.name}</h3>
                  <p>{institution.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer>
        <div className="container">
          <span>Monitoramento Hidrológico · Projeto Integrador</span>
          <span>Aplicação acadêmica · Dados simulados · Python + Django + React</span>
          <span>
            Ilustrações:{' '}
            <a href="https://github.com/jdecked/twemoji" {...externalLink}>Twemoji</a> · CC BY 4.0
          </span>
        </div>
      </footer>
    </div>
  )
}

export default Home
