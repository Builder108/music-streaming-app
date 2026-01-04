export const getTracks = async () => {
  const res = await fetch("http://localhost:5000/api/tracks")
  return res.json()
}
