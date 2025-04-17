import { useState } from "react";
import { Player } from "@lottiefiles/react-lottie-player";
import introAnimation from "./assets/introAnimation.json";
import "./App.css";

function App() {
  const [file, setFile] = useState(null);
  const [response, setResponse] = useState(null);
  const [showSignUp, setShowSignUp] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setResponse(null);
  };

  const handleSubmit = async () => {
    if (!file) return alert("Please upload an image first.");
    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await fetch("http://localhost:5003/api/posture", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      setResponse(data);
    } catch (err) {
      console.error("Upload failed:", err);
    }
  };

  const handleRegister = (e) => {
    e.preventDefault();
    setSuccessMsg(true);
    setTimeout(() => {
      setShowSignUp(false);
      setSuccessMsg(false);
    }, 3000);
  };

  return (
    <>
      {!showSignUp ? (
        <button className="top-btn" onClick={() => setShowSignUp(true)}>
          Sign Up
        </button>
      ) : (
        <button className="top-btn" onClick={() => setShowSignUp(false)}>
          ← Back
        </button>
      )}

      {showSignUp ? (
        <div className="upload-box">
          <h2>Create an Account</h2>
          {successMsg && (
            <p style={{ color: "green", fontWeight: "bold", marginBottom: "10px" }}>
              ✅ Registration successful! Redirecting...
            </p>
          )}
          <form onSubmit={handleRegister}>
            <input type="text" placeholder="Full Name" required />
            <input type="email" placeholder="Email Address" required />
            <input type="password" placeholder="Password" required />
            <button type="submit">Register</button>
          </form>
        </div>
      ) : (
        <div className="upload-box">
          <h1>PosePerfect</h1>
          <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="centered-input"
            />
            <br />
            <button type="submit">Upload and Analyze</button>
          </form>

          {!file && (
            <div className="lottie-container">
              <Player
                autoplay
                loop
                src={introAnimation}
                style={{ height: "250px", width: "250px" }}
              />
            </div>
          )}

          {file && (
            <div className="image-preview">
              <img src={URL.createObjectURL(file)} alt="Preview" />
            </div>
          )}

          {response && (
            <div className="feedback">
              <p><strong>Pose:</strong> {response.pose}</p>
              <p><strong>Correct:</strong> {response.correct.toString()}</p>
              <p><strong>Suggestion:</strong> {response.suggestion}</p>
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default App;






