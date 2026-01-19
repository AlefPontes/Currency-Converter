import { ApiError } from "./error.js";
import { getBid } from "./apiRequest.js";
import { findPath } from "./graph.js";

export async function convert(initialCurrency, finalCurrency) {
  if (initialCurrency === finalCurrency) return 1;

  try {
    return Number((await getBid(`${initialCurrency}-${finalCurrency}`))[0].bid);
  } catch (error) {
    if (!(error instanceof ApiError)) throw error;
  }

  try {
    const path = await findPath(initialCurrency, finalCurrency);
    if (!path) throw new ApiError(404);

    let result = 1;

    for (const step of path.slice(1)) {
      const bid = Number((await getBid(step.apiPair))[0].bid);
      result *= step.inverted ? 1 / bid : bid;
    }

    return result;
  } catch (error) {
    throw error;
  }
}
