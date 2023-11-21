import fetch from "../include/fetch.js";
import { URL_Builder } from "./utility.js";


export interface GeoCoord {
  lat: number;
  lon: number;
}
// (AJ 11/21) - Updated with an interface to handle type error (was getting
//               a type error in on line 35, this addition fixed it)
interface ApiResponseItem {
  lon: string; // Assuming these are strings that you'll parse into numbers
  lat: string;
}

export function fetchGeoCoord(query: string): Promise<GeoCoord> {
  // (AJ 11/21) - Updated function to incorporate URL_Builder function from utility.ts
  const geoURL = URL_Builder("https://220.maxkuechen.com/geoCoord/search", "q", query); // turn query str into url
  return fetch(geoURL)
    .then(apiResponse => {
      if (!apiResponse.ok) {
        throw new Error(apiResponse.statusText); // displaying error message
      }
      return apiResponse.json(); // grab response as json
    })
      .then((data: ApiResponseItem[]) => { // using new interface to handle type error
      if (!Array.isArray(data) || data.length === 0) {
        // if data is not an array/is empty throw error
        throw new Error("No results");
      }

      const first = data[0]; // first element in array, check if it has lon and lat values
      if (typeof first !== "object" || !("lon" in first) || !("lat" in first)) {
        throw new Error("Invalid response format"); // if not throw error
      }
      return {
        // returning appropriate values (lon and lat)
        lon: Number.parseFloat(first.lon),
        lat: Number.parseFloat(first.lat),
      };
    });
}
