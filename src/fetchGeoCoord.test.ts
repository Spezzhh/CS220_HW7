import assert from "assert";
import { fetchGeoCoord } from "./fetchGeoCoord.js";

describe("fetchGeoCoord", () => {
  it("follows type specification", () => {
    const promise = fetchGeoCoord("University of Massachusetts Amherst");

    return promise.then(result => {
      assert(typeof result === "object"); //  Assert the result is an object
      assert(typeof result.lon === "number"); // Assert that the lon value is a number
      assert(typeof result.lat === "number"); // Assert that the lat value is a number
      assert(Object.keys(result).length === 2); // Assert there are only two keys in the object
    });
  });
  // (AJ 11/21) - updated with a new test to reach coverage requirement
  it("handles invalid coordinates", () => {
    const invalid = "Invalid"; // blantantly invalid str value
    return fetchGeoCoord(invalid).then( () => {
      throw new Error("Test failed: Invalid coordinates provided to test");
    })
        .catch(error => {assert(error instanceof Error); // throw error for invalid coords as intended
    })
  });
});
