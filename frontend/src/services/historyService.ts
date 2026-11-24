import { mockSeries, MOCK_REFERENCE_TIME } from '../data/series'
import type { Metric, Observation, Period } from '../types/series'

export type MockScenario = 'normal' | 'error' | 'empty'

type HistoryRequest = {
  stationId: number
  metric: Metric
  period: Period
  scenario: MockScenario
}

export async function getMockHistory({
  stationId,
  metric,
  period,
  scenario,
}: HistoryRequest): Promise<Observation[]> {
  // Simula uma requisição que demora para responder.
  await new Promise<void>((resolve) => {
    setTimeout(resolve, 800)
  })

  if (scenario === 'error') {
    throw new Error('Não foi possível carregar o histórico.')
  }

  if (scenario === 'empty') {
    return []
  }

  const stationSeries = mockSeries.find(
    (series) => series.stationId === stationId
  )

  if (!stationSeries) {
    throw new Error('Estação não encontrada.')
  }

  const startTime =
    Date.parse(MOCK_REFERENCE_TIME) -
    period * 60 * 60 * 1000

  return stationSeries.observations
    .filter(
      (observation) =>
        Date.parse(observation.timestamp) >= startTime
    )
    .map((observation) => ({
      ...observation,
      // Mantém somente a métrica solicitada.
      level: metric === 'level' ? observation.level : null,
      rain: metric === 'rain' ? observation.rain : null,
    }))
}
