import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Account() {
  const [error, setError] = useState("");
  const [infos, setInfos] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    getData();
  }, []);

  const token = localStorage.getItem("userToken");

  async function getData() {
    const requestData = new URLSearchParams({
      token: token,
    });

    try {
      const response = await fetch("/api/user/getInfos", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Accept: "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: requestData,
      });

      const body = await response.json();
      setInfos(body);

      if (body.error) {
        setError(body.error);
        navigate("/");
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function logOut() {
    const requestData = new URLSearchParams({
      token: token,
    });

    try {
      await fetch("/api/user/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Accept: "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: requestData,
      });

      navigate("/");
    } catch (error) {
      console.error("Error:", error);
    }
  }

  return (
    <>
      <h2>Hello {infos.name}!</h2>
      <p>Member since : {infos.createdAt}</p>
      <p>Mail Address : {infos.email}</p>
      <button onClick={logOut}>Log out</button>
      <a href="/secret">Don't click here</a>
    </>
  );
}
