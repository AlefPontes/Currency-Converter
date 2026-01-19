import { ApiError, InternetError } from "./error.js";

const BASE_URL = "https://economia.awesomeapi.com.br/json";

export async function getBid(currency) {
  try {
    const response = await fetch(`${BASE_URL}/last/${currency}`);

    if (!response.ok) {
      throw new ApiError(response.statusText, response.status); // Erro de API
    }

    const cotacoes = await response.json();
    const values = Object.values(cotacoes);

    return values;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new InternetError("Falha de rede");
  }
}

export async function getCurrencyCombinations() {
  try {
    const response = await fetch(`${BASE_URL}/AVAILABLE`);

    if (!response.ok) {
      throw new ApiError(response.statusText, response.status); // Erro de API
    }

    const combinations = await response.json();

    return combinations;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new InternetError("Falha de rede");
  }
}

export async function getCurrencyNames() {
  try {
    const response = await fetch(`${BASE_URL}/available/uniq`);

    if (!response.ok) {
      throw new ApiError(response.statusText, response.status); // Erro de API
    }

    const currencyNames = await response.json();

    return currencyNames;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new InternetError("Falha de rede");
  }
}
