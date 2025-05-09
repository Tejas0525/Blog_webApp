import { useState } from "react";
//import axios from 'axios';

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  async function registerUser(ev){
    ev.preventDefault();
    console.log("registerUser Called");
    const response = await fetch('http://localhost:8000/register',{
      method: 'POST',
      body: JSON.stringify({username,password}),
      headers:{'Content-Type':'application/json'}
    })
    if(response.status === 200){
      alert('Registration Sucessfull');
    }else{
      alert('Registration Failed');
    }
    
  }

  return (
    <form className="register" onSubmit={registerUser}>
      <h1>Register</h1>
      <input
        type="text"
        placeholder="username"
        value={username}
        onChange={(ev) => {
          setUsername(ev.target.value);
        }}
      />
      <input
        type="password"
        placeholder="password"
        value={password}
        onChange={(ev) => {
          setPassword(ev.target.value);
        }}
      />
      <button>Register</button>
    </form>
  );
}
