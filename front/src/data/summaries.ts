import type { StationSummary } from '../types/summary'

export const mockSummaries: StationSummary[] = [
  {
    stationId: 1,
    level: {
      value: 2.45,
      timestamp: '2026-11-19T12:00:00Z',
    },
    rain: {
      value: 8.2,
      timestamp: '2026-11-19T12:00:00Z',
    },
  },
  {
    stationId: 2,
    level: {
      value: 3.18,
      timestamp: '2026-11-19T11:00:00Z',
    },
    rain: {
      value: 0,
      timestamp: '2026-11-19T11:00:00Z',
    },
  },
  {
    stationId: 3,
    level: {
      value: 1.76,
      timestamp: '2026-11-19T10:00:00Z',
    },
    rain: {
      value: null,
      timestamp: null,
    },
  },
]
