import React, { useState } from 'react'
import axios from "axios"
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'



const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const navigate = useNavigate()

  const handleSubmit = async (event) => {
    event.preventDefault()
    try{
      const response = await axios.post("https://mern-project-dec5.onrender.com/login", { email, password })
      const {user, token } = response.data
      setUser(user)
      localStorage.setItem("token", token)
      localStorage.setItem("user", JSON.stringify(user))
      navigate("/dashboard")
    }
    catch(err){
      console.error(err)
    }
    setEmail('')
    setPassword('')
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4">
        <h1 className='text-xl font-bold'>Login</h1>
        <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder='email'
              className="border border-gray-300 p-2 rounded-md w-full"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required />
            <input
              type="password"
              placeholder='password'
              className="border border-gray-300 p-2 rounded-md w-full"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required/>
            <button
              type="submit"
              className="border border-black px-6 py-3 rounded-lg bg-white text-black hover:bg-gray-700 hover:text-white transition duration-100 ease-in-out"
            >
              Login
            </button>
            {
                user && (
                    <div className="bg-red-500">
                        <h1>{user.name}</h1>
                        <h1>{user.email}</h1>
                    </div>
                )
            }
        </form>
        <Link to="/register">Go to Register </Link>
    </div>
  )
}


export default Login
