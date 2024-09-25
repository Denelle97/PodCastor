import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { fetchShowById } from "./CallingApi";
import FavoriteHeart from "./FavoriteHeart"; // Import the favorite heart component
import './Styles/Episodes.css'; // Import the custom CSS file

function Episodes() {
  const { showId, seasonNumber } = useParams(); // Extract showId and seasonNumber from the URL
  const [showData, setShowData] = useState(null);
  const [favoriteEpisodes, setFavoriteEpisodes] = useState({}); // Track favorite episodes with an object

  useEffect(() => {
    const fetchData = async () => {
      try {
        const showData = await fetchShowById(showId); // Fetch the show data by ID
        setShowData(showData);
      } catch (error) {
        console.error("Error fetching show data:", error); // Log the error if fetching fails
      }
    };
    fetchData(); // Call the fetchData function
  }, [showId]);

  // Toggle favorite for an episode
  const toggleFavoriteEpisode = (episodeId) => {
    setFavoriteEpisodes((prevFavorites) => ({
      ...prevFavorites,
      [episodeId]: !prevFavorites[episodeId] // Toggle the favorite state for this episode
    }));
  };

  if (!showData) {
    return <div>Loading...</div>; // Display while data is being fetched
  }

  // Ensure seasonNumber is parsed to an integer to match the season number
  const parsedSeasonNumber = parseInt(seasonNumber, 10);

  // Find the season by matching the parsed season number
  const seasonData = showData.seasons.find(
    (season) => season.number === parsedSeasonNumber
  );

  if (!seasonData) {
    return <div>Season not found</div>; // If season is not found
  }

  return (
    <div className="episodes-container">
      <h2 className="episodes-header">Season {seasonData.number}</h2>
      <div className="episodes-list">
        {/* Iterate over each episode and display it */}
        {seasonData.episodes.map((episode) => (
          <div className="episode-item" key={episode.id}>
            <div className="episode-title">{episode.title}</div>
            <div className="episode-meta">Episode {episode.number}</div>
            
            {/* Add FavoriteHeart component for each episode */}
            <FavoriteHeart
              isFavorite={!!favoriteEpisodes[episode.id]} // Check if this episode is a favorite
              onToggleFavorite={() => toggleFavoriteEpisode(episode.id)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default Episodes;
