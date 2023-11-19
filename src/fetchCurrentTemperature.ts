import { GeoCoord } from "./fetchGeoCoord.js";
import fetch from "../include/fetch.js";
import { URL } from "url";

interface TemperatureReading {
  time: string[];
  temperature_2m: number[];
}

export function fetchCurrentTemperature(coords: GeoCoord): Promise<TemperatureReading> {
  // TODO

  function makeSearchURL(latQuery: string, longQuery: string): string {
    // Construct a new URL object using the resource URL
    const searchURL = new URL(" https://220.maxkuechen.com/currentTemperature/forecast?");
    searchURL.searchParams.append("latitude", latQuery);
    searchURL.searchParams.append("longitude", longQuery);
    searchURL.searchParams.append("hourly", "temperature_2m");
    searchURL.searchParams.append("temperature_unit", "fahrenheit");

    return searchURL.toString();
  }

  return fetch(makeSearchURL(String(coords.lat), String(coords.lon)))
    .then((response: Response) => (response.ok ? response.json() : Promise.reject(new Error(response.statusText))))
    .then((data: { hourly: TemperatureReading }) => {
      const time: string[] = data.hourly.time;
      const temperature_2m: number[] = data.hourly.temperature_2m;
      return { time, temperature_2m };
    });
}
import { GeoCoord } from "./fetchGeoCoord.js";
import fetch from "../include/fetch.js";
import { URL } from "url";

interface TemperatureReading {
  time: string[];
  temperature_2m: number[];
}

export function fetchCurrentTemperature(coords: GeoCoord): Promise<TemperatureReading> {
  // TODO

  function makeSearchURL(latQuery: string, longQuery: string): string {
    // Construct a new URL object using the resource URL
    const searchURL = new URL(" https://220.maxkuechen.com/currentTemperature/forecast?");
    searchURL.searchParams.append("latitude", latQuery);
    searchURL.searchParams.append("longitude", longQuery);
    searchURL.searchParams.append("hourly", "temperature_2m");
    searchURL.searchParams.append("temperature_unit", "fahrenheit");

    return searchURL.toString();
  }

  return fetch(makeSearchURL(String(coords.lat), String(coords.lon)))
    .then((response: Response) => (response.ok ? response.json() : Promise.reject(new Error(response.statusText))))
    .then((data: { hourly: TemperatureReading }) => {
      const time: string[] = data.hourly.time;
      const temperature_2m: number[] = data.hourly.temperature_2m;
      return { time, temperature_2m };
    });
}
