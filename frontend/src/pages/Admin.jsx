import { useEffect, useState } from "react"

export default function Admin() {
  const [title, setTitle] = useState("")
  const [artist, setArtist] = useState("")
  const [category, setCategory] = useState("music")
  const [audioUrl, setAudioUrl] = useState("")
  const [coverUrl, setCoverUrl] = useState("")
  const [tracks, setTracks] = useState([])

  /* =========================
     LOAD ALL TRACKS
  ========================= */
  const loadTracks = async () => {
    const res = await fetch("http://localhost:5000/api/tracks")
    const data = await res.json()
    setTracks(data)
  }

  useEffect(() => {
    loadTracks()
  }, [])

  /* =========================
     UPLOAD TRACK
  ========================= */
  const uploadTrack = async () => {
    if (!title || !artist || !audioUrl) {
      alert("Title, Artist & Audio URL required")
      return
    }

    await fetch("http://localhost:5000/api/admin/upload", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        artist,
        category,
        audio_url: audioUrl,
        cover_url: coverUrl
      })
    })

    setTitle("")
    setArtist("")
    setAudioUrl("")
    setCoverUrl("")

    loadTracks()
  }

  /* =========================
     ❌ DELETE TRACK
  ========================= */
  const deleteTrack = async (id) => {
    const confirmDelete = window.confirm("Delete this track permanently?")
    if (!confirmDelete) return

    await fetch(`http://localhost:5000/api/admin/track/${id}`, {
      method: "DELETE"
    })

    // update UI instantly
    setTracks(prev => prev.filter(t => t.id !== id))
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h1 className="text-2xl font-bold mb-6">🛠 Admin Panel</h1>

      {/* UPLOAD FORM */}
      <div className="bg-zinc-900 p-4 rounded mb-8 space-y-3">
        <input
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Title"
          className="w-full p-2 rounded bg-zinc-800"
        />

        <input
          value={artist}
          onChange={e => setArtist(e.target.value)}
          placeholder="Artist"
          className="w-full p-2 rounded bg-zinc-800"
        />

        <select
          value={category}
          onChange={e => setCategory(e.target.value)}
          className="w-full p-2 rounded bg-zinc-800"
        >
          <option value="music">Music</option>
          <option value="podcast">Podcast</option>
        </select>

        <input
          value={audioUrl}
          onChange={e => setAudioUrl(e.target.value)}
          placeholder="Audio URL"
          className="w-full p-2 rounded bg-zinc-800"
        />

        <input
          value={coverUrl}
          onChange={e => setCoverUrl(e.target.value)}
          placeholder="Cover Image URL (optional)"
          className="w-full p-2 rounded bg-zinc-800"
        />

        <button
          onClick={uploadTrack}
          className="bg-green-500 text-black px-4 py-2 rounded font-semibold"
        >
          Upload
        </button>
      </div>

      {/* TRACK LIST */}
      <h2 className="text-xl font-semibold mb-3">All Tracks</h2>

      {tracks.map(track => (
        <div
          key={track.id}
          className="bg-zinc-900 p-3 rounded mb-2 flex justify-between items-center"
        >
          <div>
            <p className="font-semibold">{track.title}</p>
            <p className="text-sm text-gray-400">
              {track.artist} • {track.category}
            </p>
          </div>

          {/* ❌ DELETE BUTTON */}
          <button
            onClick={() => deleteTrack(track.id)}
            className="text-red-400 hover:text-red-600 text-sm"
          >
            ❌ Delete
          </button>
        </div>
      ))}

      {tracks.length === 0 && (
        <p className="text-gray-500">No tracks uploaded yet</p>
      )}
    </div>
  )
}
