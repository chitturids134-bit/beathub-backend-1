import React, { useState, useEffect } from "react";
import "./App.css";
import Register from "./Register.jsx";
import Login from "./Login.jsx";
import SongList from "./SongList.jsx";
import PlaylistList from "./PlaylistList.jsx";

function App() {
  const [route, setRoute] = useState(window.location.hash);

  useEffect(() => {
    const onHashChange = () => setRoute(window.location.hash);
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  let content;
  if (route === "#register") {
    content = <Register />;
  } else if (route === "#login") {
    content = <Login />;
  } else if (route === "#songs") {
    content = <SongList />;
  } else if (route === "#playlists") {
    content = <PlaylistList />;
  } else {
    content = (
      <>
        <section className="hero-section">
          <h2>Stream, Share, and Discover Music</h2>
          <p>
            Welcome to BeatHub, your modern music streaming and sharing
            platform. Enjoy curated playlists, discover new artists, and manage
            your own music library.
          </p>
          <div className="cta-buttons">
            <a className="btn primary" href="#register">
              Get Started
            </a>
            <a className="btn" href="#login">
              Sign In
            </a>
            <a className="btn" href="#songs">
              Song Library
            </a>
            <a className="btn" href="#playlists">
              Playlists
            </a>
          </div>
        </section>
        <section id="features" className="features-section">
          <h3>Features</h3>
          <ul>
            <li>🎧 Personalized playlists</li>
            <li>🔒 Secure authentication</li>
            <li>👩‍🎤 Artist & album management</li>
            <li>📈 Song analytics</li>
            <li>🌐 Social sharing</li>
          </ul>
        </section>
      </>
    );
  }

  return (
    <div className="beathub-landing">
      <header className="beathub-header">
        <h1>🎵 BeatHub</h1>
        <nav>
          <a href="#features">Features</a>
          <a href="#songs">Song Library</a>
          <a href="#playlists">Playlists</a>
          <a href="#login">Login</a>
          <a href="#register">Register</a>
        </nav>
      </header>
      <main>{content}</main>
      <footer className="beathub-footer">
        <small>
          © {new Date().getFullYear()} BeatHub. All rights reserved.
        </small>
      </footer>
    </div>
  );
}

export default App;
