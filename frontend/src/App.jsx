import { Routes, Route } from "react-router-dom"

import Login from "./pages/Login"
import Register from "./pages/Register"
import Home from "./pages/Home"
import Playlist from "./pages/Playlist"
import Browse from "./pages/Browse"
import Music from "./pages/Music"
import User from "./pages/User"
import Admin from "./pages/Admin"
import PlaylistList from "./pages/PlaylistList"

import AudioPlayer from "./components/Player/AudioPlayer"
import { useContext } from "react"
import { PlayerContext } from "./context/PlayerContext"

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/user" element={<User />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/music" element={<Music />} />
        <Route path="/browse" element={<Browse />} />

        {/* Playlist routes */}
        <Route path="/playlists" element={<PlaylistList />} />
        <Route path="/playlist/:playlistId" element={<Playlist />} />
      </Routes>

      {/* GLOBAL AUDIO PLAYER */}
      <GlobalPlayer />
    </>
  )
}

function GlobalPlayer() {
  const { currentSong } = useContext(PlayerContext)
  return <AudioPlayer song={currentSong} />
}

export default App
