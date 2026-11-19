import { useState } from 'react'

import { mockStations } from './data/stations'
import { mockSummaries } from './data/summaries'
import {
  mockSeries,
  MOCK_REFERENCE_TIME,
} from './data/series'

import MeasurementCard from './components/MeasurementCard'
import HistoryChart from './components/HistoryChart'

import type { Metric, Period } from './types/series'

import './App.css'

function App() {
  const [selectedStationId, setSelectedStationId] =
    useState<number>(mockStations[0].id)

  const [selectedMetric, setSelectedMetric] =
    useState<Metric>('level')

  const [selectedPeriod, setSelectedPeriod] =
    useState<Period>(24)

  const selectedStation = mockStations.find(
    (station) => station.id === selectedStationId
  )

  const selectedSummary = mockSummaries.find(
    (summary) => summary.stationId === selectedStationId
  )

  const selectedSeries = mockSeries.find(
    (series) => series.stationId === selectedStationId
  )

  const startTime =
    Date.parse(MOCK_REFERENCE_TIME) -
    selectedPeriod * 60 * 60 * 1000

  const filteredObservations =
    selectedSeries?.observations.filter(
      (observation) =>
        Date.parse(observation.timestamp) >= startTime
    ) ?? []

  return (
    <main>
      <header>
        <h1>Monitoramento Hidrológico</h1>
        <p>
          Painel de acompanhamento de níveis de rios
          e índices de precipitação.
        </p>
      </header>

      <section aria-labelledby="estacoes-titulo">
        <h2 id="estacoes-titulo">
          Estações hidrológicas
        </h2>

        <label htmlFor="station-select">
          Selecione uma estação:
        </label>

        <select
          id="station-select"
          value={selectedStationId}
          onChange={(event) =>
            setSelectedStationId(Number(event.target.value))
          }
        >
          {mockStations.map((station) => (
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
              <strong>Município:</strong>{' '}
              {selectedStation.municipality}
            </p>
          </div>
        )}
      </section>

      <section aria-labelledby="resumo-titulo">
        <h2 id="resumo-titulo">Resumo das leituras</h2>

        {selectedSummary ? (
          <div className="measurements-grid">
            <MeasurementCard
              title="Nível do rio"
              measurement={selectedSummary.level}
              unit="m"
            />

            <MeasurementCard
              title="Precipitação"
              measurement={selectedSummary.rain}
              unit="mm/h"
            />
          </div>
        ) : (
          <p>Não há resumo disponível para esta estação.</p>
        )}
      </section>

      <section aria-labelledby="historico-titulo">
        <h2 id="historico-titulo">
          Histórico de medições
        </h2>

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
                  className={
                    selectedPeriod === period ? 'active' : ''
                  }
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

        <HistoryChart
          observations={filteredObservations}
          metric={selectedMetric}
        />

        <p className="history-note">
          Horários em UTC. Período de demonstração com
          referência em 19/11/2026 às 12:00 UTC.
        </p>
      </section>

      <footer>
        <p>
          Dados simulados — sem finalidade operacional.
        </p>
      </footer>
    </main>
  )
}

export default App
