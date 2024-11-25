const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

// Enable CORS for all origins (useful for local development)
app.use(cors());

// Middleware to parse JSON bodies
app.use(express.json());

// Mock database for high scores (in-memory)
let highScore = 0;

// Endpoint to get the current high score
app.get('/api/high-scores', (req, res) => {
  res.json({ highScore });
});

// Endpoint to update the high score
app.post('/api/high-scores', (req, res) => {
  const { highScore: newHighScore } = req.body;
  if (newHighScore > highScore) {
    highScore = newHighScore;
    res.status(200).send('High score updated');
  } else {
    res.status(400).send('New high score is not higher');
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
