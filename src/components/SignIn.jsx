import React, { useState } from "react";
import { supabase } from "../supabase";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import './Styles/SignIn.css'; // Import the custom CSS file

function SignIn() {
  const { user } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      setError(error.message);
    } else {
      setError('');
      navigate('/');
    }
  };

  if (user) {
    navigate('/');
    return null;
  }

  return (
    <div className="signin-container">
      <div className="signin-box">
        <h2 className="signin-header">Sign In</h2>
        {error && <p className="signin-error">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-control"
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-control"
            />
          </div>
          <button type="submit" className="signin-button">Sign In</button>
        </form>
      </div>
    </div>
  );
}

export default SignIn;

