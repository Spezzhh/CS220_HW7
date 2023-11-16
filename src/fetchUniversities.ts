import fetch from "../include/fetch.js";

interface Name {
  name: string
}

export function fetchUniversities(query: string): Promise<string[]> {
  // TODO

  function makeSearchURL(query: string): string {
    // Construct a new URL object using the resource URL
    const searchURL = new URL("http://220.maxkuechen.com/universities/search?");
    searchURL.searchParams.append("name", query);
    return searchURL.toString();
  }

  const url: string = makeSearchURL(query);

  // return new Promise((resolve, reject) =>
  //   fetch(url)
  //     .then(res => res.ok ? res.json() : reject(new Error("No results found for query.")))
  //     .then(json =>
  //       Array.isArray(json) && json.length > 0
  //         ? json
  //         : reject(new Error("No results found for query."))
  //     )
  //     .then((data: any) => {
  //       const names: string[] = data.map((x: Name) => x.name)
  //       resolve(names)
  //     }



  //     // .then((data: Name[]) => resolve(data.map(x => x.name)))
  //     // .catch(error => reject(error)))
      
  //     // resolve(data.map(x => x.name) ))
  //     // .catch(error => reject(error))
  // ));

  return fetch(url)
      .then(res => res.ok ? res.json() : Promise.reject(new Error("No results found for query.")))
      .then(json =>
        Array.isArray(json) && json.length > 0
          ? json
          : Promise.reject(new Error("No results found for query."))
      )
      // .then((data: Name[]) => {
      //   const names: string[] = data.map((x: Name) => x.name)
      //   return names
      // }
      .then((data: Name[]) => data.map((x: Name) => x.name)
  );
}
