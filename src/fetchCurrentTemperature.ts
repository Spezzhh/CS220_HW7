import { GeoCoord } from "./fetchGeoCoord.js";
import fetch from "../include/fetch.js";
import { URL_Builder } from "./utility.js";

interface TemperatureReading {
  time: string[];
  temperature_2m: number[];
}

export function fetchCurrentTemperature(coords: GeoCoord): Promise<TemperatureReading> {
    // (AJ 11/21) - Updated function to incorporate URL_Builder function from utility.ts
    let temperatureURL: string = URL_Builder("https://220.maxkuechen.com/currentTemperature/forecast?", "latitude", String(coords.lat));
    temperatureURL = URL_Builder(temperatureURL, "longitude", String(coords.lon));
    temperatureURL = URL_Builder(temperatureURL, "hourly", "temperature_2m");
    temperatureURL = URL_Builder(temperatureURL, "temperature_unit", "fahrenheit");
    return fetch(temperatureURL)
        .then((response: Response) => {
            if (!response.ok) {
                throw new Error(response.statusText);
            }
            return response.json();
        })
        .then((data: { hourly: TemperatureReading }) => {
            const time: string[] = data.hourly.time;
            const temperature_2m: number[] = data.hourly.temperature_2m;
            return { time, temperature_2m };
        });
    }
