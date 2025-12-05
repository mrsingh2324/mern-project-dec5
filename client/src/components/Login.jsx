import React from 'react'
import axios from 'axios'


const Login = () => {

  return (
    <div className='flex flex-col items-center justify-center h-screen bg-blue-200'>
        <h1 className=''>Login</h1>
        <input type="email" placeholder='email id' className='border border-black'/>
        <input type="password" placeholder='password' className='border border-black' />
        <button className='bg-blue-500'>Login</button>
    </div>
  )
}

export default Login;