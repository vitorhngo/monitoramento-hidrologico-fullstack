export type Metric = 'level' | 'rain'

export type Period = 12 | 24 | 48

export type Observation = {
  timestamp: string
  level: number | null
  rain: number | null
}

export type StationSeries = {
  stationId: number
  observations: Observation[]
}
