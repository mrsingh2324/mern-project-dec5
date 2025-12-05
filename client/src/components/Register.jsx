import React from 'react'
import axios from 'axios'
import {useState} from 'react' 
import {Link} from 'react-router-dom';

const Register = () => {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const handleSubmit = async (e) => {

        e.preventDefault()
        try{
            const response = await axios.post("https://mern-project-dec5.onrender.com/register", {
                name,
                email,
                password
            })
            console.log(response.data)
        }
        catch(err){
            console.log(err)
        }
    }

  return (
    <div className='flex flex-col items-center justify-center h-screen bg-blue-200'>
        <h1>Register</h1>
        <form onSubmit={handleSubmit}>

        <input 
            type="text" 
            placeholder="username" 
            value={name}
            onChange={(e)=>setName(e.target.value)} 
            className='border border-black'
        />
        <input 
            type="email" 
            placeholder='email' 
            value={email} 
            onChange={(e)=>setEmail(e.target.value)} 
            className='border border-black'
            />
        <input 
            type="password" 
            placeholder='password' 
            value={password} 
            onChange={(e)=>setPassword(e.target.value)} 
            className='border border-black'
            />
        <button className='bg-blue-500' type="submit" >Register</button>
        </form>
        <Link to="/"> Go to Login</Link>
    </div>
  )
}

export default Register