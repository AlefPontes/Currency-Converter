const BASE_URL = "https://economia.awesomeapi.com.br/json";

// ALGUMAS MOEDAS NÃO TEM CONVERSÃO DIRETA, TEM QUE FAZER UMA CONVERSÃO

export async function getMoedas(fromCurrency, toCurrency) {
  try {
    const multiplicador = await verifyInUSD(fromCurrency, toCurrency);
    return multiplicador;
  } catch (e) {
    console.error(`Erro na requisição de cotação: ${e}`);
  }
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
    console.error(e);
  }
}

async function verifyInUSD(initialCurrency, finalCurrency) {
  if (initialCurrency === finalCurrency) return 1;
  else if (initialCurrency === "USD") {
    try {
      const response = await fetch(`${BASE_URL}/last/USD-${finalCurrency}`);

      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status} ${response.statusText}`);
      }
      const cotacoes = await response.json();

      const multiplicador = Number(Object.values(cotacoes)[0].bid);

      return multiplicador;
    } catch (e) {
      error(e);
    }
  } else if (finalCurrency === "USD") {
    try {
      const response = await fetch(`${BASE_URL}/last/${initialCurrency}-USD`);
      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status} ${response.statusText}`);
      }

      const cotacoes = await response.json();

      const multiplicador = Number(Object.values(cotacoes)[0].bid);

      return multiplicador;
    } catch (e) {
      error(e);
    }
  } else {
    try {
      const response = await fetch(
        `${BASE_URL}/last/${initialCurrency}-USD,${finalCurrency}-USD`
      );

      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status} ${response.statusText}`);
      }

      const cotacoes = await response.json();

      const multiplicadorFinal =
        Object.values(cotacoes)[0].bid / Object.values(cotacoes)[1].bid;

      return multiplicadorFinal;
    } catch (e) {
      error(e);
    }
  }
}

function error(err) {
  console.log(`Erro ao requisitar cotação: ${err}`);
  return 0;
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
