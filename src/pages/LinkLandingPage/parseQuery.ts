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

function parsePeer(value: string) {
  const parts = value.split("@");

  if (parts.length === 2) {
    return {
      peer_id: parts[0],
      address_hint: parts[1]
    };
  }

  return parts[0];
}

export default function parseQuery(query: string): QueryParams {
  const queryString = query.charAt(0) === "?" ? query.substr(1) : query;

  const normalizedQuery = URI.decodeQuery(queryString);
  const link = new URI(normalizedQuery);
  const linkQuery = URI.parseQuery(link.query());

  return Object.keys(linkQuery)
    .map(key => {
      // @ts-ignore
      const value = linkQuery[key];

      if (key === "peer") {
        return {
          [key]: parsePeer(value)
        };
      }

      return {
        [key]: firstOrValue(value)
      };
    })
    .reduce((acc, next) => merge(acc, next)) as QueryParams;
}
