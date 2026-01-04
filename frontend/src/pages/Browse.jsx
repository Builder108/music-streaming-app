import { useEffect, useState, useContext } from "react"
import { useNavigate } from "react-router-dom"
import { PlayerContext } from "../context/PlayerContext"

export default function Browse() {
  const { setCurrentSong } = useContext(PlayerContext)
  const navigate = useNavigate()

  const userId = "demo-user"
  const [toast, setToast] = useState("")

  const [tracks, setTracks] = useState([])
  const [playlists, setPlaylists] = useState([])
  const [activeTab, setActiveTab] = useState("all")

  const [search, setSearch] = useState("")
  const [searchResults, setSearchResults] = useState([])
const [playlistCovers, setPlaylistCovers] = useState({})

  /* =========================
     LOAD TRACKS
  ========================= */
  useEffect(() => {
    fetch("http://localhost:5000/api/tracks")
      .then(res => res.json())
      .then(data => setTracks(data))
      .catch(err => console.error(err))
  }, [])

  /* =========================
     LOAD PLAYLISTS
  ========================= */
  useEffect(() => {
    fetch(`http://localhost:5000/api/playlists/${userId}`)
      .then(res => res.json())
      .then(data => setPlaylists(data))
      .catch(err => console.error(err))
  }, [])

  useEffect(() => {
  if (!Array.isArray(playlists) || playlists.length === 0) return

  const loadCovers = async () => {
    const covers = {}

    for (const p of playlists) {
      try {
        const res = await fetch(
          `http://localhost:5000/api/playlist/${p.id}`
        )
        const songs = await res.json()

        if (
          Array.isArray(songs) &&
          songs.length > 0 &&
          songs[0].cover_url
        ) {
          covers[p.id] = songs[0].cover_url
        }
      } catch (err) {
        console.error(err)
      }
    }

    setPlaylistCovers(covers)
  }

  loadCovers()
}, [playlists])

  /* =========================
     SEARCH (DEBOUNCE)
  ========================= */
  useEffect(() => {
    if (!search.trim()) {
      setSearchResults([])
      return
    }

    const delay = setTimeout(() => {
      fetch(`http://localhost:5000/api/search?q=${search}`)
        .then(res => res.json())
        .then(data => setSearchResults(data))
    }, 400)

    return () => clearTimeout(delay)
  }, [search])

  /* =========================
     ADD TO PLAYLIST
  ========================= */
const addToPlaylist = async (playlistId, trackId) => {
  if (!playlistId) return

  try {
    const res = await fetch("http://localhost:5000/api/playlist/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        playlist_id: playlistId,
        track_id: trackId
      })
    })

    const data = await res.json()

    if (!res.ok) {
      setToast("⚠️ Song already exists in playlist")
    } else {
      setToast("✅ Added to playlist")
    }

    setTimeout(() => setToast(""), 2000)

  } catch (err) {
    console.error(err)
  }
}




  /* =========================
     DECIDE TRACK LIST
  ========================= */
  const visibleTracks =
    search.trim()
      ? searchResults
      : activeTab === "all"
      ? tracks
      : tracks.filter(t => t.category === activeTab)

  return (
    <div className="px-8 py-6 pb-32 text-white">

      {/* APP TITLE */}
      <h1 className="text-3xl font-bold mb-6 text-center">
        <span className="text-white">GenZ</span>
        <span className="text-orange-500">🎧music</span>
      </h1>

      {/* SEARCH BAR */}
      <div className="relative w-full max-w-md mx-auto mb-8">
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by song or artist..."
          className="w-full p-3 pr-12 rounded-lg bg-zinc-800 text-white outline-none"
        />
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
          🔍
        </span>
      </div>

      {/* PLAYLIST PREVIEW */}
      <div className="mb-10">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Your Playlists</h2>

          {/* ✅ View All (NO UI CHANGE) */}
          <button
            onClick={() => navigate("/playlists")}
            className="text-sm text-green-400 hover:underline"
          >
            View All
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {playlists.map(p => (
            <div
              key={p.id}
              onClick={() => navigate(`/playlist/${p.id}`)}
              className="bg-zinc-900 p-4 rounded-xl cursor-pointer hover:bg-zinc-800"
            >
              {/* ✅ COVER IMAGE (NO CROPPING) */}
              <div className="h-32 rounded-lg mb-3 overflow-hidden bg-zinc-800">
                <img
                src={playlistCovers[p.id] || "/default-playlist.png"}
                  className="h-full w-full object-cover rounded-lg mb-3"
                />
              </div>

              <p className="font-semibold truncate">{p.name}</p>
              <p className="text-xs text-gray-400">Playlist</p>
            </div>
          ))}
        </div>
      </div>

      {/* CATEGORY TABS */}
      <div className="flex gap-3 mb-8 justify-center">
        {["all", "music", "podcast"].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-1 rounded-full capitalize ${
              activeTab === tab
                ? "bg-green-500 text-black"
                : "bg-zinc-800 text-white"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* TRACK LIST */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {visibleTracks.map(track => (
          <div
            key={track.id}
            className="relative bg-zinc-900 p-4 rounded-xl hover:bg-zinc-800 transition"
          >
            {/* ▶ PLAY */}
            <div
              onClick={() => setCurrentSong(track)}
              className="cursor-pointer"
            >
              <p className="font-semibold">{track.title}</p>
              <p className="text-sm text-gray-400">{track.artist}</p>
              <p className="text-xs text-green-400 capitalize">
                {track.category}
              </p>
            </div>

            {/* ➕ ADD TO PLAYLIST (UNCHANGED POSITION & STYLE) */}
            <div className="absolute top-2 right-2">
              <select
                onChange={e => addToPlaylist(e.target.value, track.id)}
                className="bg-yellow-400 text-black text-xs rounded px-2 py-1"
              >
                <option value="">+ Playlist</option>
                {playlists.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        ))}
      </div>

      {visibleTracks.length === 0 && (
        <p className="text-center text-gray-400 mt-10">
          No results found
        </p>
      )}

      
    </div>
  )
}
