import { Link } from "react-router-dom"
import homeBg from "../assets/Home.jpg"

export default function Home() {
  return (
    <div
      className="min-h-screen bg-cover bg-center relative text-white"
      style={{
        backgroundImage: `url(${homeBg})`
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/80"></div>

      {/* Content */}
      <div className="relative z-10 flex flex-col min-h-screen">

        {/* HEADER */}
        <header className="flex justify-between items-center px-10 py-6">
          <h1 className="text-2xl font-bold tracking-wide">
              <span className="text-white">GenZ</span>
              <span className="text-orange-500">🎧music</span>
          </h1>

          <div className="space-x-4">
            <Link
              to="/login"
              className="px-5 py-2 rounded-lg border border-white/30 hover:bg-white hover:text-black transition"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="px-5 py-2 rounded-lg bg-green-500 text-black font-semibold hover:bg-green-400 transition"
            >
              Sign Up
            </Link>
            
          </div>
        </header>

        {/* HERO SECTION */}
        <main className="flex-1 flex flex-col items-center justify-center text-center px-6">
          <h2 className="text-4xl md:text-5xl font-bold mb-10">
            Feel the Music<br />🎧🎸<br />Live the Moment
          </h2>

          <p className="text-lg text-gray-300 max-w-2xl mb-10">
            Stream your favorite tracks, discover new sounds, and
            let music move your soul anytime, anywhere.
          </p>

          {/* Quotes */}
          <div className="italic text-gray-400 space-y-2 mb-10">
             “Music can change the world because it can change people.”  
    <br />
    “Where words fail, music speaks.”
          </div>

          {/* CTA Buttons */}
          <div className="flex space-x-6">
            <Link
              to="/login"
              className="px-8 py-3 rounded-xl bg-yellow-500 text-black font-bold hover:bg-green-400 transition hover:scale-105"
            >
              Get Started
            </Link>

          
          </div>
        </main>

        {/* FOOTER */}
  <footer className="px-10 py-10 border-t border-white/10 text-sm text-gray-400">
  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">

    {/* ABOUT */}
    <div>
      <p className="font-semibold text-white mb-2">About</p>
      <p>
        GenZ🎧music is a modern music streaming platform built for music and podcast
        lovers who value quality, simplicity, and immersive sound experiences.
      </p>
    </div>

    {/* HELP */}
    <div>
      <p className="font-semibold text-white mb-2">Help</p>
      <p>FAQs</p>
      <p>Support</p>
      <p>Terms & Conditions</p>
    </div>

    {/* CONTACT */}
    <div>
      <p className="font-semibold text-white mb-2">Contact</p>
      <p>support@GenZ🎧music.com</p>
      <p>+91 9157116800</p>
    </div>

  </div>


</footer>

      </div>
    </div>
  )
}
