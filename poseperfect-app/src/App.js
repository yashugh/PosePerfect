import { useState } from "react";
import "./App.css";

function App() {
  const [file, setFile] = useState(null);
  const [response, setResponse] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
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

  return (
    <div className="container">
      <h1>PosePerfect</h1>

      <input type="file" accept="image/*" onChange={handleFileChange} />
      <br />
      <button onClick={handleSubmit}>Upload and Analyze</button>

      {response && (
        <div className="feedback">
          <p><strong>Pose:</strong> {response.pose}</p>
          <p><strong>Correct:</strong> {response.correct.toString()}</p>
          <p><strong>Suggestion:</strong> {response.suggestion}</p>
        </div>
      )}
    </div>
  );
}

export default App;
