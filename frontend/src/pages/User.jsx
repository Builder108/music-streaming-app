import { useContext } from "react"
import { PlayerContext } from "../context/PlayerContext"
import AudioPlayer from "../components/Player/AudioPlayer"
import Browse from "./Browse"

export default function User() {
  const { currentSong } = useContext(PlayerContext)

  return (
    <div className="min-h-screen bg-black text-white pb-32">
      {/* USER MAIN CONTENT */}
      <Browse />

      {/* GLOBAL AUDIO PLAYER */}
      {/*<AudioPlayer song={currentSong} />*/}
    </div>
  )
}
