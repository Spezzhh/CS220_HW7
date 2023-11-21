// AJ (11/20) - built this function to reduce code duplication, as I noticed
//                that the process of building the URL was repetitive in each of the files.
import {URL} from "url";

export function URL_Builder(baseURL: string, queryName: string, queryValue: string | string[]): string {
    const searchURL = new URL(baseURL); // base url for API usage
    if (Array.isArray(queryValue)) {
        // if condition is true, for each value in the array -->
        //      append the query name and value to the search URL appropriately
        queryValue.forEach(value => searchURL.searchParams.append(queryName, value));
    }
    else {
        // append query name & value to search URL
        searchURL.searchParams.append(queryName, queryValue);
    }
    return searchURL.toString();
}
