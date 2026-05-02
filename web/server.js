const express = require('express');
const path = require('path');
const { runStage1 } = require('../src/stage1-race-condition');
const { runStage2 } = require('../src/stage2-mutex-redis');

const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

app.get('/api/run/stage1', async (req, res) => {
  try {
    const result = await runStage1(1000);
    res.json({ success: true, ...result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/run/stage2', async (req, res) => {
  try {
    const result = await runStage2(1000);
    res.json({ success: true, ...result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Web Dashboard running at http://localhost:${PORT}`);
});
