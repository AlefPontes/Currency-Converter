import { convert } from "./converter.js";
import { ApiError, InternetError } from "./error.js";
import { getCurrencyNames } from "./apiRequest.js";
import { sortArray } from "./utils.js";

const fromCurrency = document.querySelector("#from-currency");
const toCurrency = document.querySelector("#to-currency");
const valueText = document.querySelector(".convert-value");
const bidText = document.querySelector(".bid-value");
const amount = document.querySelector("#amount");
const changeBtn = document.querySelector("#change-currencys");
const loaderContainer = document.querySelector(".loader");

let multiplier = 1;

async function updateMultiplier() {
  try {
    multiplier = await convert(fromCurrency.value, toCurrency.value);
  } catch (error) {
    multiplier = null;

    if (error instanceof ApiError) {
      showApiError();
    } else if (error instanceof InternetError) {
      showNetworkError();
    }
  }
}

async function renderCountries() {
  const availableCurrencys = sortArray(await getCurrencyNames());

  availableCurrencys.forEach(([sigla, moeda]) => {
    const option = document.createElement("option");
    option.innerText = `${moeda} (${sigla})`;
    option.value = sigla;

    fromCurrency.appendChild(option);

    const newOption = option.cloneNode(true);
    toCurrency.appendChild(newOption);
  });
}

async function renderValue() {
  if (multiplier === null || Number.isNaN(multiplier)) {
    loaderContainer.classList.add("loader-hidden");
    showApiError();
    return;
  }

  valueText.classList.remove("error");

  const convertedValue = Number(amount.value * multiplier).toFixed(2);
  const formatedValue = new Intl.NumberFormat().format(convertedValue);

  valueText.innerText = `${formatedValue} ${toCurrency.value}`;
  bidText.innerText = `1 ${fromCurrency.value} = ${multiplier.toFixed(2)} ${
    toCurrency.value
  }`;
  bidText.classList.remove("hidden");
  loaderContainer.classList.add("loader-hidden");
}

function showApiError() {
  valueText.innerText = "Não foi possível realizar a cotação dessa moeda.";
  valueText.classList.add("error");
  bidText.classList.add("hidden");
}

function showNetworkError() {
  valueText.innerText = "Erro de conexão. Verifique sua internet.";
  valueText.classList.add("error");
  bidText.classList.add("hidden");
}

async function changeCurrencys() {
  const actualFromCurrency = fromCurrency.value;
  const actualToCurrency = toCurrency.value;

  fromCurrency.value = actualToCurrency;
  toCurrency.value = actualFromCurrency;

  changeValues();
}

async function changeValues() {
  loaderContainer.classList.remove("loader-hidden");
  await updateMultiplier();
  renderValue();
}

renderCountries();
renderValue();

fromCurrency.addEventListener("change", changeValues);
toCurrency.addEventListener("change", changeValues);
amount.addEventListener("input", renderValue);
changeBtn.addEventListener("click", changeCurrencys);
