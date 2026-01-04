const express = require("express");
const cors = require("cors");

const indexRoutes = require("./routes/index");
const playlistRoutes = require("./routes/playlist");

const app = express();

app.use(cors());
app.use(express.json());

// Health check
app.get("/", (req, res) => {
  res.send("Music Streaming Backend Running");
});

// Main routes
app.use("/api", indexRoutes);
app.use("/api", playlistRoutes);

module.exports = app;
