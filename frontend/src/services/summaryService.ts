// Serviço responsável por buscar o resumo atual das medições de uma estação na API.
import { apiFetch } from "./api";
import type { Summary } from "../types/summary";

export async function getSummary(
    stationId: string
): Promise<Summary> {

    return apiFetch<Summary>(
        `/api/stations/${stationId}/summary/`
    );
}