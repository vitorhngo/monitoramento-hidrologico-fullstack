// Correspondem à estrutura de resposta do resumo da API.
import type { Station } from "./station";

export interface LatestReading {
    observed_at: string;
    value: number;
    unit: string;
}

export interface Summary {
    is_simulated: boolean;
    station: Station;

    latest_readings: {
        level: LatestReading | null;
        rain: LatestReading | null;
    };
}