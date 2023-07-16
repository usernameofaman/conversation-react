import React, { useState, useEffect } from "react";
import "../App.css";
import Axios from "axios";

function App() {
  const baseUrl = import.meta.env.VITE_API_URL;

  const [values, setValues] = useState({
    name: "",
    email: "",
    password: "",
  });

  useEffect(() => {}, [values]);

  const handleChangeValues = (value) => {
    setValues((prevValue) => ({
      ...prevValue,
      [value.target.name]: value.target.value,
    }));
  };

  const handleClickButton = () => {
    // Rest of the code
    Axios.post(`${baseUrl}/register`, {
      name: values.name,
      email: values.email,
      password: values.password,
    }).then((response) => {
      if (response.data && response.data._id) {
        window.alert("Register Successful");
        window.location.href = "/";
      }
    });
  };

  return (
    <div className="App">
      <div className="container">
        <br />
        <button className="editBotton" onClick={() => (window.location.href = "/")}>
          Back
        </button>
        <br />
        <br />

        <div className="register-box">
          <input className="register-input" type="text" name="name" placeholder="Name" onChange={handleChangeValues} />
          <input className="register-input" type="text" name="email" placeholder="Email" onChange={handleChangeValues} />
          <input className="register-input" type="password" name="password" placeholder="Password" onChange={handleChangeValues} />
          <button className="register-button" onClick={handleClickButton}>
            Add
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
