import { useState } from 'react'
import axios from 'axios'
import './App.css'

const apiCall = () => {
  axios.get('http://localhost:3000').then(res => console.log(res.data))
}

export default function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <h1>Test!!</h1>
      <button onClick={apiCall}>Make API Call</button>
    </>
  )
}