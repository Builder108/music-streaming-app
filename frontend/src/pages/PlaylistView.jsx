import { useEffect, useState, useContext } from "react"
import { useParams } from "react-router-dom"
import { PlayerContext } from "../context/PlayerContext"

export default function PlaylistView() {
  const { playlistId } = useParams()
  const [tracks, setTracks] = useState([])
  const { setCurrentSong } = useContext(PlayerContext)

  useEffect(() => {
    fetch(`http://localhost:5000/api/playlist/${playlistId}`)
      .then(res => res.json())
      .then(data => setTracks(data))
  }, [playlistId])

  const removeFromPlaylist = async (trackId) => {
    await fetch("http://localhost:5000/api/playlist/remove", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ playlist_id: playlistId, track_id: trackId })
    })

    setTracks(tracks.filter(t => t.id !== trackId))
  }

  return (
    <div className="min-h-screen bg-black text-white p-6 pb-32">
      <h1 className="text-2xl font-bold mb-6">🎵 Playlist Songs</h1>

      {tracks.map(track => (
        <div
          key={track.id}
          onClick={() => setCurrentSong(track)}
          className="bg-zinc-900 p-4 rounded mb-3 cursor-pointer hover:bg-zinc-800"
        >
          <p className="font-semibold">{track.title}</p>
          <p className="text-sm text-gray-400">{track.artist}</p>

          <button
            onClick={(e) => {
              e.stopPropagation()
              removeFromPlaylist(track.id)
            }}
            className="text-xs text-red-400 mt-2"
          >
            Remove
          </button>
        </div>
      ))}
    </div>
  )
}
