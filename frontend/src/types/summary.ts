export type Measurement = {
  value: number | null
  timestamp: string | null
}

export type StationSummary = {
  stationId: number
  level: Measurement
  rain: Measurement
}
