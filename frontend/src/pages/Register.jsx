import { useState } from "react"
import { motion } from "framer-motion"
import { supabase } from "../supabaseClient"
import loginBg from "../assets/login-bg.jpg"

export default function Register() {
  const [message, setMessage] = useState("")

  const handleRegister = async (e) => {
    e.preventDefault()
    setMessage("Creating account...")

    const email = e.target.email.value
    const password = e.target.password.value
    const role = e.target.role.value

    const { data, error } = await supabase.auth.signUp({
      email,
      password
    })

    if (error) {
      setMessage(error.message)
      return
    }

    await supabase.from("profiles").insert([
      {
        id: data.user.id,
        email,
        role
      }
    ])

    setMessage("✅ Account created! You can login now.")
    e.target.reset()
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage: `url(${loginBg})`
      }}
    >
      {/* DARK OVERLAY */}
      <div className="absolute inset-0 bg-black/60"></div>

      {/* REGISTER CARD */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative z-10 w-[380px] bg-black/70 backdrop-blur-md p-8 rounded-2xl shadow-2xl hover:scale-[1.01] transition"
      >
        <h2 className="text-3xl font-bold text-white text-center mb-6">
          Create Account 🎵
        </h2>

        <form onSubmit={handleRegister} className="space-y-4">
          <input
            name="email"
            type="email"
            placeholder="Email"
            required
            className="w-full p-3 rounded-lg bg-zinc-800 text-white outline-none"
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            required
            className="w-full p-3 rounded-lg bg-zinc-800 text-white outline-none"
          />

          <select
            name="role"
            className="w-full p-3 rounded-lg bg-zinc-800 text-white"
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>

          <button
            type="submit"
            className="w-full bg-green-500 hover:bg-green-600 text-black font-semibold py-3 rounded-lg"
          >
            Register
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
