import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { fetchShowById } from "./CallingApi";
import FavoriteHeart from "./FavoriteHeart"; // Import the favorite heart component
import "./Styles/ShowPreview.css"; 

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = 'https://your-supabase-url.supabase.co';
const supabaseKey = 'your-supabase-key';
const supabase = createClient(supabaseUrl, supabaseKey);

function ShowPreview() {
  const { id } = useParams();
  const [showData, setShowData] = useState(null);
  const [selectedSeason, setSelectedSeason] = useState(null);
  const [favoriteEpisodes, setFavoriteEpisodes] = useState({});
  const [lastPlayedEpisode, setLastPlayedEpisode] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const showData = await fetchShowById(id);

        // Sort the seasons by their number
        showData.seasons.sort((a, b) => a.number - b.number);

        setShowData(showData);
        setSelectedSeason(showData.seasons[0]); // Set the first season as default

        const favorites = await getFavoritesFromSupabase();
        setFavoriteEpisodes(favorites);

        // Load last played episode from localStorage
        const lastPlayed = JSON.parse(localStorage.getItem('lastPlayed')) || {};
        if (lastPlayed.showId === id) {
          setLastPlayedEpisode(lastPlayed.episodeId);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [id]);

  // Toggle favorite for an episode
  const toggleFavoriteEpisode = async (episodeId) => {
    const newFavorites = { ...favoriteEpisodes, [episodeId]: !favoriteEpisodes[episodeId] };
    setFavoriteEpisodes(newFavorites);
    localStorage.setItem('favorites', JSON.stringify(newFavorites));
    await syncFavoritesWithSupabase(newFavorites); // Sync favorites to Supabase
  };

  // Sync favorites with Supabase
  const syncFavoritesWithSupabase = async (favorites) => {
    const { error } = await supabase
      .from('favorites')
      .upsert({ user_id: 1, favorites }); // Modify user_id and structure as needed
    if (error) console.error("Error syncing with Supabase:", error);
  };

  // Retrieve favorites from Supabase
  const getFavoritesFromSupabase = async () => {
    const { data, error } = await supabase
      .from('favorites')
      .select('favorites')
      .eq('user_id', 1); // Modify as needed
    if (error) console.error("Error fetching from Supabase:", error);
    return data ? data[0].favorites : {};
  };

  // Handle episode play, store last played episode in localStorage
  const handlePlay = (episodeId) => {
    localStorage.setItem('lastPlayed', JSON.stringify({ showId: id, seasonNumber: selectedSeason.number, episodeId }));
    setLastPlayedEpisode(episodeId);
  };

  if (!showData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="show-preview-container">
      <div className="show-header">
        <img className="show-image" src={showData.image} alt={showData.title} />
        <div className="show-details">
          <h1 className="show-title">{showData.title}</h1>
          <p className="show-description">{showData.description}</p>
          <p className="show-seasons">Seasons: {showData.seasons.length}</p>
          <p className="show-last-update">
            Last Update:{" "}
            {new Date(showData.updated).toLocaleDateString("en-US", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </p>
        </div>
      </div>

      <h3>Select a Season:</h3>
      <div className="season-selector">
        {showData.seasons.map((season, index) => (
          <button
            key={season.id}
            onClick={() => setSelectedSeason(season)}
            className={selectedSeason === season ? "active-season" : ""}
          >
            Season {index + 1}
          </button>
        ))}
      </div>

      {selectedSeason && (
        <div className="season-container">
          <h4>Season {selectedSeason.number}</h4>
          <p>Episodes: {selectedSeason.episodes.length}</p>
          <ul>
            {selectedSeason.episodes.map((episode, index) => (
              <li key={episode.id}>
                <strong>
                  Episode {index + 1}: {episode.title}
                </strong>{" "}
                -{" "}
                {new Date(episode.airDate).toLocaleDateString("en-US", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
                <p>{episode.description}</p>

                <FavoriteHeart
                  isFavorite={favoriteEpisodes[episode.id]}
                  onToggleFavorite={() => toggleFavoriteEpisode(episode.id)}
                />

                {/* Add audio player with a fallback in case no audio URL */}
                <audio
                  controls
                  onPlay={() => handlePlay(episode.id)} // Handle play
                >
                  <source src={episode.audioUrl || "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"} type="audio/mpeg" />
                  Your browser does not support the audio element.
                </audio>

                {lastPlayedEpisode === episode.id && <p>Last Played</p>}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default ShowPreview;
