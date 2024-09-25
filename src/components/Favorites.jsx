import React from "react";
import { Link } from "react-router-dom";
import "./Styles/Favorites.css"; // Ensure the custom CSS file is in place

function Favorites({ favoriteShows, favoriteEpisodes }) {
  if (favoriteShows.length === 0 && favoriteEpisodes.length === 0) {
    return <div className="favorites-empty">You haven't added any favorites yet.</div>;
  }

  return (
    <div className="favorites-container">
      <h1>Your Favorites</h1>

      {/* Favorite Shows Section */}
      {favoriteShows.length > 0 && (
        <div className="favorite-shows-section">
          <h2>Favorite Shows</h2>
          <div className="shows-grid">
            {favoriteShows.map((show) => (
              <Link to={`/Show/${show.id}`} key={show.id} className="show-card">
                <img src={show.image} alt={show.title} className="show-image" />
                <div className="show-info">
                  <h3>{show.title}</h3>
                  <p>{`Seasons: ${show.seasons}`}</p>
                  <p>{`Last Updated: ${new Date(show.updated).toLocaleDateString()}`}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Favorite Episodes Section */}
      {favoriteEpisodes.length > 0 && (
        <div className="favorite-episodes-section">
          <h2>Favorite Episodes</h2>
          <div className="episodes-list">
            {favoriteEpisodes.map((episode) => (
              <div className="episode-item" key={episode.id}>
                <h3>{episode.title}</h3>
                <p>{`Season ${episode.seasonNumber} of ${episode.showTitle}`}</p>
                <p>{`Added on: ${new Date(episode.addedToFavorite).toLocaleDateString()}`}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Favorites;
