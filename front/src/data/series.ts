import type { StationSeries } from '../types/series'

// Referência fixa para manter os testes reproduzíveis.
export const MOCK_REFERENCE_TIME = '2026-11-19T12:00:00Z'

const HOUR_IN_MS = 60 * 60 * 1000

const stationConfigs = [
  { stationId: 1, level: 2.45, rain: 8.2, lastIndex: 48 },
  { stationId: 2, level: 3.18, rain: 0, lastIndex: 47 },
  { stationId: 3, level: 1.76, rain: null, lastIndex: 46 },
]

export const mockSeries: StationSeries[] = stationConfigs.map(
  (config) => ({
    stationId: config.stationId,
    observations: Array.from({ length: 49 }, (_, index) => {
      const timestamp = new Date(
        Date.parse(MOCK_REFERENCE_TIME) -
          (48 - index) * HOUR_IN_MS
      ).toISOString()

      // Horários posteriores à última leitura não possuem dados.
      if (index > config.lastIndex) {
        return { timestamp, level: null, rain: null }
      }

      const level =
        index === config.lastIndex
          ? config.level
          : Number(
              (
                config.level +
                Math.sin(index / 4 + config.stationId) * 0.25
              ).toFixed(2)
            )

      const rain =
        index === config.lastIndex
          ? config.rain
          : Number(
              Math.max(
                0,
                Math.sin(index / 3 + config.stationId) * 6 + 3
              ).toFixed(2)
            )

      // Uma lacuna adicional para testar descontinuidade.
      if (index === 35) {
        return { timestamp, level: null, rain: null }
      }

      return { timestamp, level, rain }
    }),
  })
)
