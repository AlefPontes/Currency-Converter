import { getCurrencyCombinations } from "./apiRequest.js";

async function buildGraphFromApi() {
  try {
    const graph = {};

    const combinations = Array.from(
      Object.keys(await getCurrencyCombinations()),
    );

    for (const pair of combinations) {
      const [from, to] = pair.split("-");

      if (!graph[from]) graph[from] = [];
      if (!graph[to]) graph[to] = [];

      graph[from].push({
        currency: to,
        apiPair: `${from}-${to}`,
        inverted: false,
      });

      graph[to].push({
        currency: from,
        apiPair: `${from}-${to}`,
        inverted: true,
      });
    }

    return graph;
  } catch (error) {
    throw error;
  }
}

export async function findPath(from, to) {
  const graph = await buildGraphFromApi();
  if (!graph[from]) return null;

  const queue = [[{ currency: from, apiPair: null, inverted: false }]];
  const visited = new Set();

  while (queue.length) {
    const path = queue.shift();
    const last = path[path.length - 1];

    if (last.currency === to) return path;

    if (visited.has(last.currency)) continue;
    visited.add(last.currency);

    for (const neighbor of graph[last.currency] ?? []) {
      queue.push([...path, neighbor]);
    }
  }

  return null;
}
