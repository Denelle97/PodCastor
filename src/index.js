import React, { useState } from "react";  // Import useState from React
import ReactDOM from "react-dom/client"; // Updated for React 18
import "./index.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import {Navigation, Footer, Home, SignIn, Season, ShowPreview } from "./components";
import { AuthProvider } from './components/AuthContext.jsx'; // Import the AuthProvider
import Favorites from "./components/Favorites";

// Create the root for React 18
const root = ReactDOM.createRoot(document.getElementById("root"));

function App() {
  // Define favoriteShows and favoriteEpisodes as state variables
  const [favoriteShows, setFavoriteShows] = useState([]);
  const [favoriteEpisodes, setFavoriteEpisodes] = useState([]);


  return (
    <AuthProvider>
      <Router>
        <Navigation />
        <Routes>
          <Route path="/SignIn" element={<SignIn />} />
          <Route path="/" element={<Home favoriteShows={favoriteShows} setFavoriteShows={setFavoriteShows} />} />
          <Route path="/Season" element={<Season />} />
          <Route path="/Show/:id" element={<ShowPreview favoriteEpisodes={favoriteEpisodes} setFavoriteEpisodes={setFavoriteEpisodes} />} />
          <Route
            path="/favorites"
            element={<Favorites favoriteShows={favoriteShows} favoriteEpisodes={favoriteEpisodes} />}
          />
        </Routes>
        <Footer />
      </Router>
    </AuthProvider>
  );
}

// Render the App component
root.render(<App />);
