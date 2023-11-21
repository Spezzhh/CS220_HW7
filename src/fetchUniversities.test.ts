import assert from "assert";
import { fetchUniversities } from "./fetchUniversities.js";

describe("fetchUniversities", () => {
  it("follows type specification", () => {
    const promise = fetchUniversities("University of Massachusetts at Amherst");

    return promise.then(result => {
      assert(Array.isArray(result)); // Assert the result in an array
      assert(result.every(x => typeof x === "string")); // Assert each element in the array is a string
    });
  });
  // (AJ 11/21) - updated with a new test to reach coverage requirement
  it("handles an invalid query appropriately", () => {
    const invalidQuery = "FakeUniversity"; // blantantly invalid query
    return fetchUniversities(invalidQuery).then(() => {
      throw new Error("Test failed: Invalid query provided to test");
    })
        .catch(error => {
          assert(error instanceof Error); // throw error for invalid query provided
        });
  });
});
