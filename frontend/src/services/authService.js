import { supabase } from "../supabaseClient"

export const register = async (email, password, role) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password
  })

  if (data.user) {
    await supabase.from("profiles").insert([
      {
        id: data.user.id,
        email,
        role
      }
    ])
  }

  return { data, error }
}

export const login = async (email, password) => {
  return await supabase.auth.signInWithPassword({
    email,
    password
  })
}
