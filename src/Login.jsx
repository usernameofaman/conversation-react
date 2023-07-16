import React, { useEffect, useState } from "react";
import "./Login.css";
import Axios from "axios";
import UserView from "./components/UserView/UserView";

const Login = () => {
  const baseUrl = import.meta.env.VITE_API_URL;

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    let isLoggedIn = localStorage.getItem("loggedIn");
    if (isLoggedIn) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    Axios.post(`${baseUrl}/login`, {
      email: username,
      password: password,
    }).then((response) => {
      if (response.data && response.data._id) {
        window.alert("Login Successful");
        localStorage.setItem("loggedIn", "true");
        localStorage.setItem("user", JSON.stringify(response.data));
        window.location.href = "/";
      } else {
        window.alert("No Access");
      }
    });
  };

  return (
    <>
      {isLoggedIn ? (
        <UserView />
      ) : (
        <div className="login-container">
          <form className="login-form" onSubmit={handleSubmit}>
            <h2>Login</h2>
            <div className="input-container">
              <div style={{width:"100%"}}>
                <label htmlFor="username">Username</label>
                <input type="text" id="username" value={username} onChange={handleUsernameChange} />
              </div>
            </div>
            <div className="input-container">
              <div style={{width:"100%"}}>
                <label htmlFor="password">Password</label>
                <input type="password" id="password" value={password} onChange={handlePasswordChange} />
              </div>
            </div>
            <button className="login-button" onClick={handleSubmit}>
              Login
            </button>
            <div className="register-link">
              <p>
                Don't have an account? <a href="/register">Register</a>
              </p>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default Login;
