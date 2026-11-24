// URL base da API carregada a partir das variáveis de ambiente do Vite (.env)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Realiza requisições HTTP GET tipadas para a API do backend.
export async function apiFetch<T>(
    endpoint: string
): Promise<T> {
    // Concatena a URL base com o endpoint específico e executa a requisição
    const response = await fetch(
        `${API_BASE_URL}${endpoint}`
    );

    // Lança um erro se o status da resposta HTTP indicar falha
    if (!response.ok) {
        throw new Error(
            `Erro na API: ${response.status}`
        );
    }

    // Converte o corpo da resposta para JSON aplicando a tipagem genérica
    return response.json() as Promise<T>;
}