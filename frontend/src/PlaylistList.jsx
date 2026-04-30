import React, { useState, useEffect } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

export default function PlaylistList() {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchPlaylists();
  }, []);

  const fetchPlaylists = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_URL}/playlists`);
      const data = await res.json();
      if (res.ok && Array.isArray(data.playlists || data.docs)) {
        setPlaylists(data.playlists || data.docs);
      } else {
        setPlaylists([]);
        setError(data.message || "No playlists found.");
      }
    } catch (err) {
      setError("Failed to fetch playlists.");
      setPlaylists([]);
    }
    setLoading(false);
  };

  return (
    <div className="playlist-list-container">
      <h2>Playlists</h2>
      {loading ? (
        <p>Loading playlists...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : (
        <ul className="playlist-list">
          {playlists.length === 0 && <li>No playlists found.</li>}
          {playlists.map((playlist) => (
            <li key={playlist._id || playlist.id}>
              <strong>{playlist.name || playlist.title}</strong> (
              {playlist.songs?.length || 0} songs)
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
