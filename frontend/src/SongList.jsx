import React, { useState, useEffect } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

export default function SongList() {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");

  useEffect(() => {
    fetchSongs();
  }, []);

  const fetchSongs = async (search = "") => {
    setLoading(true);
    setError("");
    try {
      let url = `${API_URL}/songs?page=1&limit=20`;
      if (search) url += `&search=${encodeURIComponent(search)}`;
      const res = await fetch(url);
      const data = await res.json();
      if (res.ok && Array.isArray(data.songs || data.docs)) {
        setSongs(data.songs || data.docs);
      } else {
        setSongs([]);
        setError(data.message || "No songs found.");
      }
    } catch (err) {
      setError("Failed to fetch songs.");
      setSongs([]);
    }
    setLoading(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchSongs(query);
  };

  return (
    <div className="song-list-container">
      <h2>Song Library</h2>
      <form onSubmit={handleSearch} style={{ marginBottom: 16 }}>
        <input
          type="text"
          placeholder="Search songs..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>
      {loading ? (
        <p>Loading songs...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : (
        <ul className="song-list">
          {songs.length === 0 && <li>No songs found.</li>}
          {songs.map((song) => (
            <li key={song._id || song.id}>
              <strong>{song.title}</strong> by{" "}
              {song.artist?.name || song.artist || "Unknown Artist"}
              {song.album && (
                <>
                  {" "}
                  – <em>{song.album?.title || song.album}</em>
                </>
              )}
              {song.duration && (
                <>
                  {" "}
                  ({Math.round(song.duration / 60)}:
                  {(song.duration % 60).toString().padStart(2, "0")})
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
