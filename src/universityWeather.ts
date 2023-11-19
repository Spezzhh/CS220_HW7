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
    let transformedUniversities: string[] = []; // declare here for usage in
    return fetchUniversities(universityQuery)
        .then(universities => {
            if (universities.length === 0) {
                throw new Error("No results found for query."); // throw error if no results found for query
            }
            transformedUniversities = transformName // update transformedUniversities if transformName is defined appropriately
                ? universities.map(transformName)
                : universities;
            // return the promise of the fetchGeoCoord function
            return Promise.all(transformedUniversities.map(university => fetchGeoCoord(university)));
        })
        .then(coordinates => {
            // return the promise of the fetchCurrentTemperature function
            return Promise.all(coordinates.map(coord => fetchCurrentTemperature(coord)));
        })
        .then(temperatureData => {
            // grab temp info and store it here
            const averageTempResults: AverageTemperatureResults = { totalAverage: 0 };
            let totalTemp = 0;
            let totalEntries = 0;

            // for each tempData, calculate the average temp and store that value in averageTempResults variable
            temperatureData.forEach((tempData, index) => {
                const avgTemp = tempData.temperature_2m.reduce((a, b) => a + b, 0) / tempData.temperature_2m.length;
                averageTempResults[transformedUniversities[index]] = avgTemp;
                totalTemp += avgTemp;
                totalEntries++;
            });
            // compute the total average based on the totalTemp and totalEntries
            averageTempResults.totalAverage = totalTemp / totalEntries;

            return averageTempResults;
        })
        // lastly, catch any error that fell through the cracks
        .catch(error => {
            throw new Error(`Error in fetchUniversityWeather: ${error.message}`);
        });
}

export function fetchUMassWeather(): Promise<AverageTemperatureResults> {
  // TODO
  return new Promise(res => res({ totalAverage: NaN }));
}

export function fetchUCalWeather(): Promise<AverageTemperatureResults> {
  // TODO
  return new Promise(res => res({ totalAverage: NaN }));
}
