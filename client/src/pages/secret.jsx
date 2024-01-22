import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Secret() {
  const [infos, setInfos] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    getData();
  }, []);

  async function getData() {
    const token = localStorage.getItem("userToken");

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
      console.error("Error in handleSignInSubmit:", error);
    }
  }

  return (
    <>
      <h1>Chuuuuut 🤫</h1>
      <h2>Only you, {infos.name}, can access to this page...</h2>
    </>
  );
}
