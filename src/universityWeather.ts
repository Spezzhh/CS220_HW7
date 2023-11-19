import { fetchUniversities } from './fetchUniversities';
import { fetchGeoCoord, GeoCoord} from './fetchGeoCoord';
import { fetchCurrentTemperature } from './fetchCurrentTemperature';

interface AverageTemperatureResults {
  totalAverage: number;
  [key: string]: number;
}

export function fetchUniversityWeather(
  universityQuery: string,
  transformName?: (s: string) => string
): Promise<AverageTemperatureResults> {
  // TODO
  
  // fetch all the unis then check if array is valid then transform each uni and fetch the coords of that individual uni
   fetchUniversities(universityQuery).then(unis => Array.isArray(unis) && unis.length === 0 ? unis: Promise.reject(new Error("No results found")))
   .then(uni => {
    const transformed = transformName ? transformName(uni) : uni;
    return [uni, fetchGeoCoord(transformed)];
  })

  return new Promise(res => res({ totalAverage: NaN }));
}

export function fetchUMassWeather(): Promise<AverageTemperatureResults> {
  // TODO
  return new Promise(res => res({ totalAverage: NaN }));
}

export function fetchUCalWeather(): Promise<AverageTemperatureResults> {
  // TODO
  return new Promise(res => res({ totalAverage: NaN }));
}
