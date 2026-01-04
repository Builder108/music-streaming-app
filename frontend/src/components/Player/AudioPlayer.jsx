import { useEffect, useRef } from "react"

export default function AudioPlayer({ song }) {
  const audioRef = useRef(null)
  const canvasRef = useRef(null)

  const audioCtxRef = useRef(null)
  const analyserRef = useRef(null)
  const animationRef = useRef(null)

  useEffect(() => {
    if (!song || !audioRef.current) return

    const audio = audioRef.current
    audio.src = song.audio_url
    audio.crossOrigin = "anonymous"

    audio.play()

    const startVisualizer = async () => {
      // 🔑 create audio context ONLY ON USER PLAY
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)()
      }

      const audioCtx = audioCtxRef.current
      await audioCtx.resume()

      analyserRef.current = audioCtx.createAnalyser()
      analyserRef.current.fftSize = 256

      const source = audioCtx.createMediaElementSource(audio)
      source.connect(analyserRef.current)
      analyserRef.current.connect(audioCtx.destination)

      draw()
    }

    audio.onplay = startVisualizer

    return () => cancelAnimationFrame(animationRef.current)
  }, [song])

  /* =========================
     VISUALIZER DRAW
  ========================= */
  const draw = () => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    const analyser = analyserRef.current

    const bufferLength = analyser.frequencyBinCount
    const dataArray = new Uint8Array(bufferLength)

    const render = () => {
      animationRef.current = requestAnimationFrame(render)

      analyser.getByteFrequencyData(dataArray)
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const barWidth = canvas.width / bufferLength
      let x = 0

      dataArray.forEach(v => {
        const h = v / 2
        ctx.fillStyle = `rgb(${v}, 80, 255)`
        ctx.fillRect(x, canvas.height - h, barWidth - 1, h)
        x += barWidth
      })
    }

    render()
  }

  if (!song) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-zinc-900 p-3 border-t border-white/10">
      <p className="text-white font-semibold mb-2">
        🎵 {song.title} – {song.artist}
      </p>

      {/* 🎨 WAVES */}
      <canvas
        ref={canvasRef}
        width={window.innerWidth}
        height={70}
        className="w-full mb-2"
      />

      {/* 🎧 AUDIO (UNTOUCHED) */}
      <audio ref={audioRef} controls className="w-full" />
    </div>
  )
}
