import fetch from "../include/fetch.js";
import { URL_Builder } from "./utility.js";
interface Name {
  name: string;
}
export function fetchUniversities(query: string): Promise<string[]> {
  // AJ (11/20) - Updated function to remove local URL builder function
  //             and in its place, use the URL_Builder function from utility.ts
  const searchURL: string = URL_Builder("http://220.maxkuechen.com/universities/search?", "name", query);
  return fetch(searchURL)
    .then(result => (result.ok ? result.json() : Promise.reject(new Error("No results found for query."))))
    .then(json =>
      Array.isArray(json) && json.length > 0 ? json : Promise.reject(new Error("No results found for query."))
    )
    .then((data: Name[]) => data.map((x: Name) => x.name))
    .catch(error => Promise.reject(error));
}
