import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

export default function PlaylistList() {
  const [playlists, setPlaylists] = useState([])
  const [name, setName] = useState("")
  const navigate = useNavigate()

  const userId = "demo-user" // later replace with auth user

  /* =========================
     LOAD ALL PLAYLISTS
  ========================= */
  useEffect(() => {
    fetch(`http://localhost:5000/api/playlists/${userId}`)
      .then(res => res.json())
      .then(data => setPlaylists(data))
      .catch(err => console.error(err))
  }, [])

  /* =========================
     CREATE PLAYLIST
  ========================= */
  const createPlaylist = async () => {
    if (!name.trim()) return

    await fetch("http://localhost:5000/api/playlists", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: userId, name })
    })

    setName("")
    const res = await fetch(`http://localhost:5000/api/playlists/${userId}`)
    setPlaylists(await res.json())
  }

  /* =========================
     DELETE PLAYLIST
  ========================= */
  const deletePlaylist = async (playlistId) => {
    if (!window.confirm("Delete this playlist permanently?")) return

    await fetch(`http://localhost:5000/api/playlists/${playlistId}`, {
      method: "DELETE"
    })

    setPlaylists(prev => prev.filter(p => p.id !== playlistId))
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h1 className="text-2xl font-bold mb-6">🎶 Your Playlists</h1>

      {/* CREATE */}
      <div className="flex gap-2 mb-8">
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="New playlist name"
          className="p-2 rounded bg-zinc-800 text-white outline-none"
        />
        <button
          onClick={createPlaylist}
          className="bg-green-500 text-black px-4 rounded font-semibold"
        >
          Create
        </button>
      </div>

      {/* LIST */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {playlists.map(p => (
          <div
            key={p.id}
            className="bg-zinc-900 p-4 rounded-xl hover:bg-zinc-800 transition"
          >
            <div
              onClick={() => navigate(`/playlist/${p.id}`)}
              className="cursor-pointer"
            >
              <div className="h-32 bg-zinc-800 rounded mb-3 flex items-center justify-center text-3xl">
                🎶
              </div>
              <p className="font-semibold truncate">{p.name}</p>
              <p className="text-xs text-gray-400">Playlist</p>
            </div>

            <button
              onClick={() => deletePlaylist(p.id)}
              className="mt-3 text-red-400 text-sm hover:text-red-600"
            >
              🗑 Delete
            </button>
          </div>
        ))}
      </div>

      {playlists.length === 0 && (
        <p className="text-gray-400 mt-6">No playlists yet</p>
      )}
    </div>
  )
}
