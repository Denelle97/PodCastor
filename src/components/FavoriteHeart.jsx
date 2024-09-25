// FavoriteHeart.jsx
import React from "react";
import './Styles/FavoriteHeart.css';

function FavoriteHeart({ isFavorite, onToggleFavorite }) {
  return (
    <button className={`favorite-heart ${isFavorite ? "favorite" : ""}`} onClick={onToggleFavorite}>
      {isFavorite ? "♥" : "♡"}
    </button>
  );
}

export default FavoriteHeart;
