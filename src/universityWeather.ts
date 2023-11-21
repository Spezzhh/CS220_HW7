import { fetchUniversities } from "./fetchUniversities";
import { fetchGeoCoord} from "./fetchGeoCoord";
import { fetchCurrentTemperature } from "./fetchCurrentTemperature";


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
  return (
    fetchUniversities(universityQuery)
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
        let totalTempCounter = 0;
        let totalEntriesCounter = 0;

        // for each tempData, calculate the average temp and store that value in averageTempResults variable
        temperatureData.forEach((tempData, index) => {
          const avgTemp = tempData.temperature_2m.reduce((a, b) => a + b, 0) / tempData.temperature_2m.length;
          averageTempResults[transformedUniversities[index]] = avgTemp;
          totalTempCounter += avgTemp;
          totalEntriesCounter++;
        });
        // compute the total average based on the totalTempCounter and totalEntriesCounter values
        averageTempResults.totalAverage = totalTempCounter / totalEntriesCounter;
        return averageTempResults;
      })
  );
}

export function fetchUMassWeather(): Promise<AverageTemperatureResults> {
    return fetchUniversityWeather("University of Massachusetts", name => name.replace(/ at /, " "));
}

export function fetchUCalWeather(): Promise<AverageTemperatureResults> {
    return fetchUniversityWeather("University of California");
}
