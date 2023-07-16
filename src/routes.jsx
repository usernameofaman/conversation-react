import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Login";
import Register from "./components/register";

function App() {
  const [user, setUser] = React.useState({ name : "" });

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);
  return (
    <Router>
      <div className="App">
        <div style={{ display: "flex", height: "40px", padding: "15px", background: "lightgrey", justifyContent: "space-between" }}>
          <h2>Conversations</h2>
          <h2>{user.name}</h2>
        </div>
        <Routes>
          <Route exact path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
