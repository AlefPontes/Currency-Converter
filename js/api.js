import { ApiError, InternetError } from './error.js'

const BASE_URL = "https://economia.awesomeapi.com.br/json";

// ALGUMAS MOEDAS NÃO TEM CONVERSÃO DIRETA, TEM QUE FAZER UMA CONVERSÃO

export async function getMoedas(fromCurrency, toCurrency) {
  return await convert(fromCurrency, toCurrency);
}

export async function getCurrencyNames() {
  try {
    const response = await fetch(`${BASE_URL}/available/uniq`);

    if (!response.ok) {
      throw new Error("Erro na requisição da API");
    }

    const currencyNames = sortArray(await response.json());

    return currencyNames;
  } catch (e) {
    throw new ApiError("Erro ao buscar lista de moedas");
  }
}

async function convert(initialCurrency, finalCurrency) {
  if (initialCurrency === finalCurrency) return 1;

  try {
    return await getApiResponse(`${initialCurrency}-${finalCurrency}`);
  } catch (error) {
    if (!(error instanceof ApiError)) throw error;
  }

  try {
    const inverseBid = await getApiResponse(`${finalCurrency}-${initialCurrency}`);
    return 1 / inverseBid;
  } catch (error) {
    if (!(error instanceof ApiError)) throw error;
  }

  try {
    return await getApiResponse(`${initialCurrency}-USD,${finalCurrency}-USD`);;
  } catch (error) {
    throw error;
  }
}

// Retorna o multiplicador se der certo, ou retorna Erro.
async function getApiResponse(currency) {
  let response;

  try {
      response = await fetch(`${BASE_URL}/last/${currency}`);
  } catch (error) {
      throw new InternetError("Falha de rede")
  }

  if (!response.ok) {
    throw new ApiError(response.statusText, response.status); // Erro de API
  }
  
  const cotacoes = await response.json();
  const values = Object.values(cotacoes);

  if(!values.length || !values[0].bid) {
    throw new ApiError("Resposta inválida da API");
  }

  if (values.lenght === 2) {
    const bids = values.map(bid => bid.bid);
    return Number(bids[0]/bids[1]);
  }

  return Number(values[0].bid);
}

function sortArray(array) {
  const sortedCurrencys = Object.entries(array).sort(function (a, b) {
    if (b[1] > a[1]) {
      return -1;
    } else {
      return true;
    }
  });

  return sortedCurrencys;
}
