// Correspondem à estrutura de resposta da série histórica da API.
export type Metric = "level" | "rain";

export interface ObservationPoint {
    observed_at: string;
    value: number;
}

export interface ObservationSeries {
    station_id: string;
    metric: Metric;
    unit: string;
    hours: number;
    simulated: boolean;
    source: string;
    points: ObservationPoint[];
}