import axios from "axios"
import { useState,useEffect } from "react";



function App() {
  const [user, setUser] = useState(null)

  const fetchData = async() =>{
    const res = await axios.get("http://127.0.0.1:4000/");
    console.log(res.data);
    setUser(res.data);
  };

  useEffect(()=>{
    fetchData();
  }, [])

  return (
    <>
    <h1>My Page</h1>
      <div>
        {user}
      </div>
    </>
  )
}

export default App
