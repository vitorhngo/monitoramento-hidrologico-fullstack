// Serviço responsável por buscar séries históricas de medições dos sensores na API.
import { apiFetch } from "./api";

import type {
    Metric,
    ObservationSeries
} from "../types/series";

export async function getObservations(
    stationId: string,
    metric: Metric,
    hours: number = 24
): Promise<ObservationSeries> {

    const params = new URLSearchParams({
        metric,
        hours: String(hours)
    });

    return apiFetch<ObservationSeries>(
        `/api/stations/${stationId}/series/?${params}`
    );
}