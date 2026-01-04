const express = require("express")
const router = express.Router()
const supabase = require("../config/supabase")

router.post("/upload", async (req, res) => {
  const { title, artist, audio_url, cover_url } = req.body

  const { data, error } = await supabase.from("tracks").insert([
    { title, artist, audio_url, cover_url }
  ])

  res.json({ success: true })
})


module.exports = router
