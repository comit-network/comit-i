import merge from "deepmerge";
import URI from "urijs";

export interface QueryParams {
  alpha_ledger?: string;
  beta_ledger?: string;
  alpha_asset?: string;
  beta_asset?: string;
  protocol?: string;
  peer?: string;
}

function firstOrValue(value: string | string[]) {
  if (value instanceof Array) {
    return value[0];
  } else {
    return value;
  }
}

export default function parseQuery(query: string): QueryParams {
  const normalizedQuery = URI.decodeQuery(query).replace("web+comit:swap", "");

  const parsedQuery = URI.parseQuery(normalizedQuery);

  return Object.keys(parsedQuery)
    .map(key => {
      // @ts-ignore
      const value = parsedQuery[key];

      return {
        [key]: firstOrValue(value)
      };
    })
    .reduce((acc, next) => merge(acc, next)) as QueryParams;
}
