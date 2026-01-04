import { useEffect, useState, useContext } from "react"
import AudioPlayer from "../components/Player/AudioPlayer"
import { PlayerContext } from "../context/PlayerContext"

export default function Music() {
  const [songs, setSongs] = useState([])
  const { currentSong, setCurrentSong } = useContext(PlayerContext)

  // ❤️ LIKE FUNCTION
  const handleLike = (songId) => {
    fetch("http://localhost:5000/api/favorite", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: "demo-user",
        track_id: songId
      })
    })
  }

  useEffect(() => {
    fetch("http://localhost:5000/api/tracks")
      .then(res => res.json())
      .then(data => setSongs(data))
      .catch(err => console.log(err))
  }, [])

  return (
    <div style={{ paddingBottom: "120px", padding: "20px" }}>
      <h2>🎵 Songs List</h2>

      {/* 🔍 SEARCH */}
      <input
        placeholder="Search song..."
        style={{ padding: "8px", marginBottom: "15px", width: "100%" }}
        onChange={(e) => {
          fetch(`http://localhost:5000/api/search?q=${e.target.value}`)
            .then(res => res.json())
            .then(data => setSongs(data))
        }}
      />

      {/* 🎶 SONG LIST */}
      {songs.map(song => (
        <div
          key={song.id}
          style={{
            padding: "10px",
            marginBottom: "8px",
            background: "#1e1e1e",
            borderRadius: "6px",
            color: "white",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}
        >
          <div onClick={() => setCurrentSong(song)} style={{ cursor: "pointer" }}>
            🎵 {song.title} <br />
            <small>{song.artist}</small>
          </div>

          {/* ❤️ LIKE BUTTON */}
          <button
            onClick={() => handleLike(song.id)}
            style={{ background: "none", border: "none", cursor: "pointer" }}
          >
            🤍
          </button>
        </div>
      ))}

      {/* <AudioPlayer song={currentSong} />*/}
    </div>
  )
}
