const express = require("express");
const router = express.Router();
const supabase = require("../config/supabase");

/* =========================
   CREATE PLAYLIST
========================= */
router.post("/playlists", async (req, res) => {
  const { user_id, name } = req.body;

  if (!user_id || !name) {
    return res.status(400).json({ error: "user_id and name required" });
  }

  const { data, error } = await supabase
    .from("playlists")
    .insert([{ user_id, name }])
    .select("*");

  if (error) return res.status(400).json(error);

  res.status(201).json(data[0]);
});

/* =========================
   GET USER PLAYLISTS
========================= */
router.get("/playlists/:userId", async (req, res) => {
  const { userId } = req.params;

  const { data, error } = await supabase
    .from("playlists")
    .select("*")
    .eq("user_id", userId);

  if (error) return res.status(400).json(error);

  res.json(data);
});

/* =========================
   ADD SONG TO PLAYLIST
========================= */
router.post("/playlist/add", async (req, res) => {
  const { playlist_id, track_id } = req.body;

  if (!playlist_id || !track_id) {
    return res.status(400).json({ error: "playlist_id & track_id required" });
  }

const { error } = await supabase
  .from("playlist_tracks")
  .insert([{ playlist_id, track_id }])

if (error) {
  // duplicate entry
  return res.status(409).json({
    message: "Song already exists in playlist"
  })
}

res.json({
  message: "Added to playlist"
});
});

/* =========================
   GET SONGS OF A PLAYLIST
========================= */
router.get("/playlist/:playlistId", async (req, res) => {
  const { playlistId } = req.params;

  const { data: links, error: linkError } = await supabase
    .from("playlist_tracks")
    .select("track_id")
    .eq("playlist_id", playlistId);

  if (linkError) {
    return res.status(500).json({ error: linkError.message });
  }

  if (!links || links.length === 0) {
    return res.json([]);
  }

  const trackIds = links.map(l => l.track_id);

  const { data: tracks, error: trackError } = await supabase
    .from("tracks")
    .select("*")
    .in("id", trackIds);

  if (trackError) {
    return res.status(500).json({ error: trackError.message });
  }

  res.json(tracks);
});

/* =========================
   GET SINGLE PLAYLIST
========================= */
router.get("/playlist/info/:playlistId", async (req, res) => {
  const { playlistId } = req.params

  const { data, error } = await supabase
    .from("playlists")
    .select("*")
    .eq("id", playlistId)
    .single()

  if (error) {
    return res.status(400).json(error)
  }

  res.json(data)
})

/* =========================
   REMOVE SONG FROM PLAYLIST
========================= */
router.delete("/playlist/remove", async (req, res) => {
  const { playlist_id, track_id } = req.body;

  const { error } = await supabase
    .from("playlist_tracks")
    .delete()
    .match({ playlist_id, track_id });

  if (error) return res.status(400).json(error);

  res.json({ success: true });
});

/* =========================
   RENAME PLAYLIST
========================= */
/* =========================
   RENAME PLAYLIST (FINAL)
========================= */
router.put("/playlist/rename", async (req, res) => {
  const { playlist_id, name } = req.body

  console.log("RENAME HIT:", playlist_id, name) // 🔴 DEBUG LINE

  if (!playlist_id || !name) {
    return res.status(400).json({
      error: "playlist_id and name are required"
    })
  }

  const { data, error } = await supabase
    .from("playlists")
    .update({ name })
    .eq("id", playlist_id)
    .select("*")   // ⭐ IMPORTANT

  if (error) {
    console.error("RENAME ERROR:", error)
    return res.status(500).json(error)
  }

  console.log("RENAME SUCCESS:", data)

  res.json(data[0])
});

module.exports = router;
