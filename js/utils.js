export function sortArray(array) {
  const sortedCurrencys = Object.entries(array).sort(function (a, b) {
    if (b[1] > a[1]) {
      return -1;
    } else {
      return true;
    }
  });

  return sortedCurrencys;
}
