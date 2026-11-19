import { useState } from 'react'
import { mockStations } from './data/stations'
import { mockSummaries } from './data/summaries'
import MeasurementCard from './components/MeasurementCard'
import './App.css'

function App() {
  const [selectedStationId, setSelectedStationId] =
    useState<number>(mockStations[0].id)

  const selectedStation = mockStations.find(
    (station) => station.id === selectedStationId
  )

  const selectedSummary = mockSummaries.find(
    (summary) => summary.stationId === selectedStationId
  )

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
        <p>
          Aqui serão exibidos os gráficos de nível
          e chuva para o período selecionado.
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
