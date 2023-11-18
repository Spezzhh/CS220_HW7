import fetch from "../include/fetch.js";
import { URL } from "url";

export interface GeoCoord {
    lat: number;
    lon: number;
}
// Helper that builds a URL for the geoCoord API
function makeGeoURL(query: string): string {
    const searchURL = new URL("https://220.maxkuechen.com/geoCoord/search"); // base url for our API usage
    searchURL.searchParams.append("q", (query));
    return searchURL.toString();
}

export function fetchGeoCoord(query: string): Promise<GeoCoord> {
    // AJ - Base implementation 11/16 & 11/17
    const geoURL = makeGeoURL(query); // turn query str into url
    console.log("URL being fetched:", geoURL); // url debugging print statement
    return fetch(geoURL)
        .then(apiResponse => {
            if (!apiResponse.ok) {
                throw new Error(apiResponse.statusText); // displaying error message
            }
            return apiResponse.json(); // grab response as json
        })
        .then(data => {
            if (!Array.isArray(data) || data.length === 0) { // if data is not an array/is empty throw error
                throw new Error("No results");
            }

            const first = data[0]; // first element in array, check if it has lon and lat values
            if (typeof first !== 'object' || !('lon' in first) || !('lat' in first)) {
                throw new Error('Invalid response format'); // if not throw error
            }
            return { // returning appropriate values (lon and lat)
                lon: Number.parseFloat(first.lon),
                lat: Number.parseFloat(first.lat)
            };
        });
}