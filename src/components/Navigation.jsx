import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import Search from "./Search"; // Import the Search component
import { useAuth } from "./AuthContext"; // Import the authentication context
import { supabase } from "../supabase";
import "./Styles/Navigation.css"; // Import the custom CSS file for navigation

function Navigation() {
  const { user } = useAuth(); // Access the current user from context
  const navigate = useNavigate(); // Use navigate for redirects

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error signing out:", error.message);
    } else {
      navigate("/SignIn"); // Redirect to the sign-in page after sign-out
    }
  };

  return (
    <div>
      <nav className="navbar">
        <div className="container">
          {/* Brand */} 
          <NavLink className="navbar-brand" to="/">
            PodCastor
          </NavLink>

          {/* Navigation Links */}
          <div className="navbar-right">
            <ul className="navbar-nav">
              <li className="nav-item">
                <NavLink className="nav-link" to="/">
                  Home
                </NavLink>
              </li>
              {user ? (
                <li className="nav-item">
                  <button
                    className="nav-link logout-btn"
                    onClick={handleSignOut}
                  >
                    Logout
                  </button>
                </li>
              ) : (
                <li className="nav-item">
                  <NavLink className="nav-link" to="/SignIn">
                    Login
                  </NavLink>
                </li>
              )}
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default Navigation;
