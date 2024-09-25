import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Fuse from "fuse.js"; // Import Fuse.js for fuzzy search
import { fetchAllShows } from "./CallingApi";
import genreMapping from "./genreMapping";
import FavoriteHeart from "./FavoriteHeart"; // Import FavoriteHeart component
import './Styles/Home.css'; // Add custom CSS for Home

function Home() {
  const [shows, setShows] = useState([]);
  const [filteredShows, setFilteredShows] = useState([]);
  const [favorites, setFavorites] = useState([]); // Track favorites
  const [searchText, setSearchText] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("");
  const [sortOption, setSortOption] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const getShows = await fetchAllShows();
        setShows(getShows);
        setFilteredShows(getShows); // Initialize filteredShows to be the same as shows
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  // Initialize Fuse.js for fuzzy search
  const fuse = new Fuse(shows, {
    keys: ["title", "description"], // Fields to search on
    threshold: 0.3, // Adjust to control fuzzy search sensitivity
  });

  // Function to handle search
  const handleSearch = (e) => {
    const searchText = e.target.value.toLowerCase();
    setSearchText(searchText);

    if (searchText === "") {
      setFilteredShows(shows);
    } else {
      const result = fuse.search(searchText);
      setFilteredShows(result.map(({ item }) => item)); // Map results to items
    }
  };

  // Function to handle sorting
  const handleSort = (option) => {
    setSortOption(option);
    let sortedShows = [...filteredShows];

    if (option === "title-asc") {
      sortedShows.sort((a, b) => a.title.localeCompare(b.title));
    } else if (option === "title-desc") {
      sortedShows.sort((a, b) => b.title.localeCompare(a.title));
    } else if (option === "date-asc") {
      sortedShows.sort((a, b) => new Date(a.updated) - new Date(b.updated));
    } else if (option === "date-desc") {
      sortedShows.sort((a, b) => new Date(b.updated) - new Date(a.updated));
    }

    setFilteredShows(sortedShows);
  };

  // Function to handle genre filter
  const handleGenreFilter = (genreKey) => {
    setSelectedGenre(genreKey);
    const filtered = shows.filter((show) =>
      show.genres.includes(parseInt(genreKey)) 
    );
    setFilteredShows(filtered);
  };

  // Function to reset the filters
  const resetFilters = () => {
    setFilteredShows(shows);
    setSearchText("");
    setSelectedGenre("");
    setSortOption("");
  };

  // Toggle favorite for a show
  const toggleFavoriteShow = (showId) => {
    setFavorites((prevFavorites) => {
      if (prevFavorites.includes(showId)) {
        return prevFavorites.filter((id) => id !== showId); // Remove from favorites
      } else {
        return [...prevFavorites, showId]; // Add to favorites
      }
    });
  };

  if (!shows || shows.length === 0) {
    return <div>Loading shows...</div>;
  }

  return (
    <div className="home-container">
      <h1 className="home-title">PodCastor</h1>

      {/* Search and Sort Section */}
      <div className="search-sort-controls">
        <input
          type="text"
          placeholder="Search shows by title"
          value={searchText}
          onChange={handleSearch}
        />
        <div className="sort-options">
          <button onClick={() => handleSort("title-asc")}>Title A-Z</button>
          <button onClick={() => handleSort("title-desc")}>Title Z-A</button>
          <button onClick={() => handleSort("date-asc")}>Date Ascending</button>
          <button onClick={() => handleSort("date-desc")}>Date Descending</button>
        </div>
      </div>

      {/* Genre Filter Section */}
      <div className="genre-filters">
        <h3>Filter by Genre:</h3>
        <div className="genre-buttons">
          {Object.entries(genreMapping).map(([genreKey, genreName]) => (
            <button
              key={genreKey}
              onClick={() => handleGenreFilter(genreKey)}
              className={selectedGenre === genreKey ? 'active-genre' : ''}
            >
              {genreName}
            </button>
          ))}
        </div>
        <button onClick={resetFilters} className="reset-filters-btn">Reset Filters</button>
      </div>

      {/* Shows Grid */}
      <div className="shows-grid">
        {filteredShows.map((show) => (
          <div key={show.id} className="show-card">
            <Link to={`/Show/${show.id}`} className="show-link">
              <img src={show.image} alt={show.title} className="show-image" />
              <div className="show-info">
                <h3>{show.title}</h3>
                <p>{"Seasons: " + show.seasons}</p>
                <p>{genreMapping[show.genres[0]]}</p>
                <p>
                  {"Last Update: " +
                    new Date(show.updated).toLocaleDateString("en-US", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                </p>
              </div>
            </Link>
            {/* Add FavoriteHeart component for each show */}
            <FavoriteHeart
              isFavorite={favorites.includes(show.id)}
              onToggleFavorite={() => toggleFavoriteShow(show.id)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;