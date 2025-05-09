import { useContext } from "react";
import { useState } from "react";
import {Navigate} from 'react-router-dom'
import { UserContext } from "../UserContext";
export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [redirect, SetRedirect] = useState(false);
  const {setUserInfo} = useContext(UserContext);
  
  async function loginUser(ev) {
    ev.preventDefault();
    console.log("loginUser Called");
    const response = await fetch("http://localhost:8000/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    if (response.ok) {
      response.json().then(userInfo =>{
        setUserInfo(userInfo);
        SetRedirect(true);
      });
      
    }else{
        alert("Wrong Credentials!")
    }
  }

if(redirect){
    return <Navigate to={'/'} />
}
  return (
    <form className="login" onSubmit={loginUser}>
      <h1>Login</h1>
      <input
        type="text"
        placeholder="username"
        value={username}
        onChange={(ev) => setUsername(ev.target.value)}
      />
      <input
        type="password"
        placeholder="password"
        value={password}
        onChange={(ev) => setPassword(ev.target.value)}
      />
      <button>Login</button>
    </form>
  );
}
