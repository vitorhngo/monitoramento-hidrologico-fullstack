import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import { getStations } from '../services/stationService'
import { getSummary } from '../services/summaryService'
import { getObservations } from '../services/seriesService'

import type { Station } from '../types/station'
import type { Summary } from '../types/summary'
import type {
  Metric,
  ObservationPoint,
} from '../types/series'

import MeasurementCard from '../components/MeasurementCard'
import HistoryChart from '../components/HistoryChart'

import '../App.css'

type HistoryStatus = 'loading' | 'success' | 'error'
type Period = 12 | 24 | 48

function Dashboard() {
  const [stations, setStations] = useState<Station[]>([])
  const [selectedStationId, setSelectedStationId] = useState<string>('')

  const [selectedMetric, setSelectedMetric] = useState<Metric>('level')
  const [selectedPeriod, setSelectedPeriod] = useState<Period>(24)

  const [selectedSummary, setSelectedSummary] = useState<Summary | null>(null)
  const [observations, setObservations] = useState<ObservationPoint[]>([])

  const [stationsLoading, setStationsLoading] = useState(true)
  const [summaryLoading, setSummaryLoading] = useState(false)
  const [status, setStatus] = useState<HistoryStatus>('loading')

  const [errorMessage, setErrorMessage] = useState('')
  const [summaryError, setSummaryError] = useState('')
  const [retryCount, setRetryCount] = useState(0)

  // Título da aba do navegador.
  useEffect(() => {
    document.title = 'Painel | Monitoramento Hidrológico'
  }, [])

  // Localiza a estação selecionada na lista recebida da API.
  const selectedStation = stations.find(
    (station) => station.id === selectedStationId
  )

  // Busca as estações disponíveis assim que a aplicação é iniciada.
  useEffect(() => {
    let cancelled = false

    getStations()
      .then((data) => {
        if (cancelled) return

        setStations(data)

        // Seleciona a primeira estação retornada pela API.
        if (data.length > 0) {
          setSelectedStationId(data[0].id)
        }
      })
      .catch((error: unknown) => {
        if (cancelled) return

        setErrorMessage(
          error instanceof Error
            ? error.message
            : 'Não foi possível carregar as estações.'
        )
      })
      .finally(() => {
        if (!cancelled) setStationsLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  // Busca o resumo sempre que a estação selecionada é alterada.
  useEffect(() => {
    if (!selectedStationId) return

    let cancelled = false

    setSummaryLoading(true)
    setSummaryError('')
    setSelectedSummary(null)

    getSummary(selectedStationId)
      .then((data) => {
        if (!cancelled) setSelectedSummary(data)
      })
      .catch((error: unknown) => {
        if (cancelled) return

        setSummaryError(
          error instanceof Error
            ? error.message
            : 'Não foi possível carregar o resumo da estação.'
        )
      })
      .finally(() => {
        if (!cancelled) setSummaryLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [selectedStationId])

  // Busca a série histórica conforme estação, métrica e período selecionados.
  useEffect(() => {
    if (!selectedStationId) return

    let cancelled = false

    setStatus('loading')
    setObservations([])
    setErrorMessage('')

    getObservations(selectedStationId, selectedMetric, selectedPeriod)
      .then((data) => {
        if (cancelled) return

        // A API retorna ObservationSeries; o gráfico recebe somente seus pontos.
        setObservations(data.points)
        setStatus('success')
      })
      .catch((error: unknown) => {
        if (cancelled) return

        setErrorMessage(
          error instanceof Error
            ? error.message
            : 'Não foi possível carregar o histórico.'
        )
        setStatus('error')
      })

    // Impede que uma resposta antiga sobrescreva a seleção mais recente.
    return () => {
      cancelled = true
    }
  }, [selectedStationId, selectedMetric, selectedPeriod, retryCount])

  function retryHistory() {
    setRetryCount((previous) => previous + 1)
  }

  if (stationsLoading) {
    return <p>Carregando estações...</p>
  }

  if (stations.length === 0) {
    return (
      <main>
        <p>{errorMessage || 'Nenhuma estação foi encontrada na API.'}</p>
      </main>
    )
  }

  return (
    <main>
      <header>
        <Link className="back-link" to="/">
          ← Página inicial
        </Link>
        <h1>Monitoramento Hidrológico</h1>
        <p>
          Painel de acompanhamento de níveis de rios
          e índices de precipitação.
        </p>
      </header>

      <section aria-labelledby="estacoes-titulo">
        <h2 id="estacoes-titulo">Estações hidrológicas</h2>

        <label htmlFor="station-select">
          Selecione uma estação:
        </label>

        <select
          id="station-select"
          value={selectedStationId}
          onChange={(event) => setSelectedStationId(event.target.value)}
        >
          {stations.map((station) => (
            <option key={station.id} value={station.id}>
              {station.name}
            </option>
          ))}
        </select>

        {selectedStation && (
          <div className="station-details">
            <h3>{selectedStation.name}</h3>
            <p>
              <strong>Rio:</strong> {selectedStation.river}
            </p>
            <p>
              <strong>Município:</strong> {selectedStation.municipality}
            </p>
          </div>
        )}
      </section>

      <section aria-labelledby="resumo-titulo">
        <h2 id="resumo-titulo">Resumo das leituras</h2>

        {summaryLoading ? (
          <p>Carregando resumo...</p>
        ) : summaryError ? (
          <p role="alert">{summaryError}</p>
        ) : selectedSummary ? (
          <div className="measurements-grid">
            {selectedSummary.latest_readings.level ? (
              <MeasurementCard
                title="Nível do rio"
                measurement={selectedSummary.latest_readings.level}
              />
            ) : (
              <p>Não há leitura de nível disponível.</p>
            )}

            {selectedSummary.latest_readings.rain ? (
              <MeasurementCard
                title="Precipitação"
                measurement={selectedSummary.latest_readings.rain}
              />
            ) : (
              <p>Não há leitura de precipitação disponível.</p>
            )}
          </div>
        ) : (
          <p>Não há resumo disponível para esta estação.</p>
        )}
      </section>

      <section aria-labelledby="historico-titulo">
        <h2 id="historico-titulo">Histórico de medições</h2>

        <div className="history-controls">
          <div className="metric-controls">
            <span className="control-label">Métrica:</span>

            <div className="button-group">
              <button
                type="button"
                className={selectedMetric === 'level' ? 'active' : ''}
                aria-pressed={selectedMetric === 'level'}
                onClick={() => setSelectedMetric('level')}
              >
                Nível do rio
              </button>

              <button
                type="button"
                className={selectedMetric === 'rain' ? 'active' : ''}
                aria-pressed={selectedMetric === 'rain'}
                onClick={() => setSelectedMetric('rain')}
              >
                Precipitação
              </button>
            </div>
          </div>

          <div className="period-controls">
            <span className="control-label">Período:</span>

            <div className="button-group">
              {([12, 24, 48] as Period[]).map((period) => (
                <button
                  key={period}
                  type="button"
                  className={selectedPeriod === period ? 'active' : ''}
                  aria-pressed={selectedPeriod === period}
                  onClick={() => setSelectedPeriod(period)}
                >
                  {period} h
                </button>
              ))}
            </div>
          </div>
        </div>

        <h3>
          {selectedMetric === 'level'
            ? 'Nível do rio (m)'
            : 'Precipitação (mm/h)'}
        </h3>

        {status === 'loading' && (
          <div className="history-feedback" role="status">
            Carregando histórico...
          </div>
        )}

        {status === 'error' && (
          <div className="history-feedback error-feedback" role="alert">
            <p>{errorMessage}</p>
            <button type="button" onClick={retryHistory}>
              Tentar novamente
            </button>
          </div>
        )}

        {status === 'success' && (
          observations.length > 0 ? (
            <HistoryChart
              observations={observations}
              metric={selectedMetric}
            />
          ) : (
            <div className="history-feedback">
              Não há observações disponíveis para o período selecionado.
            </div>
          )
        )}

        <p className="history-note">
          Horários em UTC. Período consultado conforme a seleção realizada.
        </p>
      </section>

      <footer>
        <p>Dados fornecidos pela API de monitoramento hidrológico.</p>
      </footer>
    </main>
  )
}

export default Dashboard