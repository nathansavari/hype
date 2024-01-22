import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

function Home() {
  const [signInEmail, setSignInEmail] = useState("");
  const [signInPassword, setSignInPassword] = useState("");

  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");
  const [signUpName, setSignUpName] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSignInSubmit = async (e) => {
    e.preventDefault();

    const requestData = new URLSearchParams({
      email: signInEmail,
      password: signInPassword,
    });

    try {
      const response = await fetch("/api/user/connect", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Accept: "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: requestData,
      });

      const body = await response.json();
      console.log(body);

      if (body.message && body.token) {
        // On met le token en local storage
        localStorage.setItem("userToken", body.token);

        navigate("/account");
      }

      if (body.error) {
        setError(body.error);
        setMessage("");
      }
    } catch (error) {
      console.error("Error in handleSignInSubmit:", error);
    }
  };

  const handleSignUpSubmit = async (e) => {
    e.preventDefault();

    const requestData = new URLSearchParams({
      email: signUpEmail,
      password: signUpPassword,
      name: signUpName,
    });

    try {
      const response = await fetch("/api/user/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Accept: "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: requestData,
      });

      const body = await response.json();
      if (body.message) {
        setMessage(body.message);
        setError("");
      }
      if (body.error) {
        setError(body.error);
        setMessage("");
      }
    } catch (error) {
      console.error("Error in handleSignInSubmit:", error);
    }
  };

  return (
    <>
      {error ? (
        <h2>{error}</h2>
      ) : (
        message && (
          <h2>
            Welcome, your profile is now created! You can try to login now
          </h2>
        )
      )}

      <div className="cards">
        <div className="card">
          <h2>Sign in</h2>
          <form onSubmit={handleSignInSubmit}>
            <input
              type="email"
              value={signInEmail}
              onChange={(e) => setSignInEmail(e.target.value)}
              placeholder="Email"
              required
            />
            <input
              type="password"
              value={signInPassword}
              onChange={(e) => setSignInPassword(e.target.value)}
              placeholder="Password"
              required
            />
            <button type="submit">Sign In</button>
          </form>
        </div>

        <div className="card">
          <h2>Sign up</h2>
          <form onSubmit={handleSignUpSubmit}>
            <input
              type="name"
              value={signUpName}
              onChange={(e) => setSignUpName(e.target.value)}
              placeholder="Name"
              required
            />
            <input
              type="email"
              value={signUpEmail}
              onChange={(e) => setSignUpEmail(e.target.value)}
              placeholder="Email"
              required
            />
            <input
              type="password"
              value={signUpPassword}
              onChange={(e) => setSignUpPassword(e.target.value)}
              placeholder="Password"
              required
            />
            <button type="submit">Sign Up</button>
          </form>
        </div>
      </div>
    </>
  );
}

export default Home;
