import { useState } from "react"
import { motion } from "framer-motion"
import { supabase } from "../supabaseClient"
import { useNavigate } from "react-router-dom"
import loginBg from "../assets/login-bg.jpg"

export default function Login() {
  const [message, setMessage] = useState("")
  const navigate = useNavigate()

  const handleLogin = async (e) => {
  e.preventDefault()
  setMessage("Logging in...")

  const email = e.target.email.value
  const password = e.target.password.value

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })

  if (error) {
    setMessage(error.message)
    return
  }

  // 🔑 get role from profiles table
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", data.user.id)
    .single()

  if (profile.role === "admin") {
    navigate("/admin")
  } else {
    navigate("/user")
  }
}

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: `url(${loginBg})` }}
    >
      {/* dark overlay for readability */}
      <div className="absolute inset-0 bg-black/60"></div>

      {/* login card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative z-10 w-full max-w-md rounded-2xl shadow-2xl
                   bg-gradient-to-b from-black to-zinc-900
                   p-8 text-white
                   hover:scale-[1.01] transition"
      >
        <h2 className="text-3xl font-bold text-center mb-6 flex items-center justify-center gap-2">
          Welcome Back <span>🎧</span>
        </h2>

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            name="email"
            type="email"
            placeholder="Email"
            required
            className="w-full p-3 rounded-lg bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-green-500"
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            required
            className="w-full p-3 rounded-lg bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-green-500"
          />

          <button
            type="submit"
            className="w-full bg-green-500 hover:bg-green-600
                       text-black font-semibold py-3 rounded-lg"
          >
            Log In
          </button>
        </form>

        {message && (
          <p className="text-center text-sm text-gray-300 mt-4">
            {message}
          </p>
        )}
      </motion.div>
    </div>
  )
}
