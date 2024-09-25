// Define the base URL for the podcast API
const BASE_URL = "https://podcast-api.netlify.app";

// Fetch all shows (returns an array of PREVIEW objects)
export async function fetchAllShows() {
  // Send a GET request to fetch all shows from the API endpoint
  const response = await fetch(`${BASE_URL}/shows`);
  // Parse the response as JSON data
  const data = await response.json();
  // Return the data (an array of shows)
  return data;
}

// Fetch a single show by its ID, including its seasons and episodes
export async function fetchShowById(id) {
  // Send a GET request to fetch details of a show using its ID
  const response = await fetch(`${BASE_URL}/id/${id}`);
  // Parse the response as JSON data
  const data = await response.json();
  
  // Log the data for debugging
  console.log("Show Data:", data);
  
  // Return the data (the specific show with its seasons and episodes)
  return data;
}

// Fetch episodes by a specific season ID
export async function fetchEpisodesBySeasonId(seasonId) {
  // Send a GET request to fetch episodes for the given season ID
  const response = await fetch(`${BASE_URL}/seasons/${seasonId}/episodes`);
  // Parse the response as JSON data
  const data = await response.json();
  // Return the data (episodes for the season)
  return data;
}
