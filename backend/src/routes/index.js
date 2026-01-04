const express = require("express");
const router = express.Router();
const supabase = require("../config/supabase");

// TEST ROUTE
router.get("/", (req, res) => {
  res.json({ message: "API routes working" });
});

// GET TRACKS
router.get("/tracks", async (req, res) => {
  const { data, error } = await supabase
    .from("tracks")
    .select("*");

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.json(data);
});

// SEARCH (title + artist)
router.get("/search", async (req, res) => {
  const { q } = req.query;

  if (!q || q.trim() === "") {
    return res.json([]);
  }

  const { data, error } = await supabase
    .from("tracks")
    .select("*")
    .or(`title.ilike.%${q}%,artist.ilike.%${q}%`);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.json(data);
});

// BROWSE
router.get("/browse/music", async (req, res) => {
  const { data } = await supabase
    .from("tracks")
    .select("*")
    .eq("type", "music");

  res.json(data);
});

router.get("/browse/podcasts", async (req, res) => {
  const { data } = await supabase
    .from("tracks")
    .select("*")
    .eq("type", "podcast");

  res.json(data);
});

router.get("/playlist/:playlistId", async (req, res) => {
  const { playlistId } = req.params;

  // 1️⃣ Get track IDs from playlist_tracks
  const { data: links, error: linkError } = await supabase
    .from("playlist_tracks")
    .select("track_id")
    .eq("playlist_id", playlistId);

  if (linkError) {
    console.error(linkError);
    return res.status(500).json({ error: linkError.message });
  }

  if (!links || links.length === 0) {
    return res.json([]);
  }

  const trackIds = links.map(l => l.track_id);

  // 2️⃣ Get full track data (INCLUDING cover_url)
  const { data: tracks, error: trackError } = await supabase
    .from("tracks")
    .select("id, title, artist, audio_url, cover_url, category")
    .in("id", trackIds);

  if (trackError) {
    console.error(trackError);
    return res.status(500).json({ error: trackError.message });
  }

  res.json(tracks);
});



// ADMIN UPLOAD
router.post("/admin/upload", async (req, res) => {
  const { title, artist, category, audio_url, cover_url } = req.body

  if (!title || !artist || !category || !audio_url) {
    return res.status(400).json({
      error: "title, artist, category and audio_url are required"
    })
  }

  const { data, error } = await supabase
    .from("tracks")
    .insert([
      {
        title,
        artist,
        category,
        audio_url,
        cover_url
      }
    ])
    .select("*")

  if (error) {
    return res.status(500).json({ error: error.message })
  }

  res.json(data[0])
});

router.get("/admin/tracks", async (req, res) => {
  const { data, error } = await supabase
    .from("tracks")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    return res.status(500).json({ error: error.message })
  }

  res.json(data)
});

router.delete("/admin/tracks/:id", async (req, res) => {
  const { id } = req.params

  const { error } = await supabase
    .from("tracks")
    .delete()
    .eq("id", id)

  if (error) {
    console.error(error)
    return res.status(500).json({ error: error.message })
  }

  res.json({ success: true })
});

router.delete("/playlists/:playlistId", async (req, res) => {
  const { playlistId } = req.params

  const { error } = await supabase
    .from("playlists")
    .delete()
    .eq("id", playlistId)

  if (error) {
    return res.status(500).json({ error: error.message })
  }

  res.json({ success: true })
});

module.exports = router;
