import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { fetchShowById, fetchEpisodesBySeasonId } from "./CallingApi";
import "./Styles/Season.css"; // Import the CSS file for styling

function Season() {
  const { showId } = useParams();
  const [showData, setShowData] = useState(null);
  const [episodesBySeason, setEpisodesBySeason] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const showData = await fetchShowById(showId);
        setShowData(showData);

        // Fetch episodes for each season
        const episodesPromises = showData.seasons.map(async (season) => {
          const episodes = await fetchEpisodesBySeasonId(season.id);
          return { [season.id]: episodes };
        });

        const episodesResults = await Promise.all(episodesPromises);
        const episodesObject = episodesResults.reduce((acc, curr) => {
          return { ...acc, ...curr };
        }, {});

        setEpisodesBySeason(episodesObject);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [showId]);

  if (!showData) {
    return <div>Loading...</div>; // Loading message
  }

  return (
    <div className="season-container">
      <h1 className="season-title">{showData.title}</h1>
      <div className="seasons-grid">
        {showData.seasons.map((season) => (
          <div key={season.id} className="season-card">
            <div className="season-body">
              <h2 className="season-heading">Season {season.number}</h2>
              <p>{season.description}</p>
              <p>
                Release Date:{" "}
                {season.releaseDate && !isNaN(new Date(season.releaseDate).getTime())
                  ? new Date(season.releaseDate).toLocaleDateString("en-US", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })
                  : "No release date available"}
              </p>

              {/* Display Episodes for the season */}
              <h5>Episodes:</h5>
              <ul className="episodes-list">
                {episodesBySeason[season.id]?.map((episode) => (
                  <li key={episode.id} className="episode-item">
                    <strong>{episode.title}</strong> -{" "}
                    {new Date(episode.airDate).toLocaleDateString("en-US", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                    <p>{episode.description}</p>
                  </li>
                )) || <p>No episodes available.</p>}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Season;
