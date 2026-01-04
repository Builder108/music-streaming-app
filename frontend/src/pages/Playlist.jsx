import { useEffect, useState, useContext } from "react"
import { useParams } from "react-router-dom"
import { PlayerContext } from "../context/PlayerContext"

export default function Playlist() {
  const { playlistId } = useParams()
  const { setCurrentSong } = useContext(PlayerContext)

  const [songs, setSongs] = useState([])
  const [playlistName, setPlaylistName] = useState("")
  const [isEditing, setIsEditing] = useState(false)

  /* =========================
     LOAD PLAYLIST INFO + SONGS
  ========================= */
  useEffect(() => {
    if (!playlistId) return

    // ✅ Fetch playlist info (NAME)
    fetch(`http://localhost:5000/api/playlist/info/${playlistId}`)
      .then(res => res.json())
      .then(data => {
        if (data?.name) {
          setPlaylistName(data.name)
        }
      })
      .catch(err => console.error(err))

    // ✅ Fetch playlist songs
    fetch(`http://localhost:5000/api/playlist/${playlistId}`)
      .then(res => res.json())
      .then(data => setSongs(data))
      .catch(err => console.error(err))
  }, [playlistId])

  /* =========================
     RENAME PLAYLIST
  ========================= */
  const renamePlaylist = async () => {
    if (!playlistName.trim()) return

    await fetch("http://localhost:5000/api/playlist/rename", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        playlist_id: playlistId,
        name: playlistName
      })
    })

    setIsEditing(false)
  }

  /* =========================
     REMOVE SONG
  ========================= */
  const removeSong = async (trackId) => {
    await fetch("http://localhost:5000/api/playlist/remove", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        playlist_id: playlistId,
        track_id: trackId
      })
    })

    // update UI instantly
    setSongs(prev => prev.filter(song => song.id !== trackId))
  }

  return (
    <div className="min-h-screen bg-black text-white p-6 pb-32">

      {/* PLAYLIST HEADER */}
      <div className="flex items-center gap-3 mb-6">
        {isEditing ? (
          <>
            <input
              value={playlistName}
              onChange={e => setPlaylistName(e.target.value)}
              className="bg-zinc-800 text-white px-3 py-1 rounded"
            />
            <button
              onClick={renamePlaylist}
              className="text-green-400 text-sm"
            >
              Save
            </button>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-bold">🎶 {playlistName}</h1>
            <button
              onClick={() => setIsEditing(true)}
              className="text-yellow-400 text-sm"
            >
              ✏️ Rename
            </button>
          </>
        )}
      </div>

      {/* SONG LIST */}
      {songs.map(song => (
        <div
          key={song.id}
          className="bg-zinc-900 p-4 rounded-xl mb-3 flex justify-between items-center hover:bg-zinc-800"
        >
          {/* ▶ PLAY SONG */}
          <div
            onClick={() => setCurrentSong(song)}
            className="cursor-pointer flex-1"
          >
            <p className="font-semibold">{song.title}</p>
            <p className="text-sm text-gray-400">{song.artist}</p>
          </div>

          {/* ❌ REMOVE SONG */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              removeSong(song.id)
            }}
            className="ml-4 text-red-400 text-sm hover:text-red-600"
          >
            ❌ Remove
          </button>
        </div>
      ))}

      {songs.length === 0 && (
        <p className="text-gray-400">No songs in this playlist</p>
      )}
    </div>
  )
}
