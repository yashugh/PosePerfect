const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');

const app = express();
const PORT = 5002;

app.use(cors());

// Setup multer to store uploaded images in memory
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Test route
app.get("/", (req, res) => {
  res.send("PosePerfect Backend is running!");
});

// POST route to handle image upload
app.post('/api/posture', upload.single('image'), (req, res) => {
  const imageFile = req.file;

  if (!imageFile) {
    return res.status(400).json({ error: 'No image uploaded' });
  }

  // TODO: Call real AI/pose API here with the image buffer

  // For now, return dummy pose feedback
  return res.json({
    pose: "Standing",
    correct: false,
    suggestion: "Straighten your back and keep your shoulders aligned."
  });
});

app.listen(PORT, () => {
  console.log(`API running at http://localhost:${PORT}`);
});
