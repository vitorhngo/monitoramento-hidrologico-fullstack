// Serviço responsável por buscar estações de monitoramento.
import { apiFetch } from "./api";
import type { Station } from "../types/station";

export async function getStations(): Promise<Station[]> {
    return apiFetch<Station[]>("/api/stations/");
}