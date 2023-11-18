import fetch from "../include/fetch.js";

interface Name {
  name: string
}

export function fetchUniversities(query: string): Promise<string[]> {
  // TODO

  function makeSearchURL(query: string): string {
    const searchURL = new URL("http://220.maxkuechen.com/universities/search?");
    searchURL.searchParams.append("name", query);
    return searchURL.toString();
  }

  const url: string = makeSearchURL(query);

  return fetch(url)
      .then(result => result.ok ? result.json() : Promise.reject(new Error("No results found for query.")))
      .then(json => Array.isArray(json) && json.length > 0 ? json : Promise.reject(new Error("No results found for query.")))
      .then((data: Name[]) => data.map((x: Name) => x.name))
      .catch(error => Promise.reject(error));
}
