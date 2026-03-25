const express = require('express');
const { exec } = require('shelljs'); // Using shelljs 0.7.0 as defined in your Dockerfile
const app = express();
const port = 3000;

// 1. HARDCODED SECRET (Tests Legit's Secret Scanning)
const GITHUB_API_KEY = "ghp_1234567890ABCDEF1234567890ABCDEF1234"; 

app.get('/', (req, res) => {
  res.send('<h1>Legit Security Vulnerable Lab</h1><p>Try the /check-site endpoint!</p>');
});

// 2. COMMAND INJECTION VULNERABILITY (Tests Legit's SAST/ASPM)
// This endpoint takes a user-provided 'url' and passes it directly to a shell command.
// Example of attack: /check-site?url=google.com;cat /etc/passwd
app.get('/check-site', (req, res) => {
  const targetUrl = req.query.url;

  if (!targetUrl) {
    return res.send('Please provide a URL via ?url=');
  }

  console.log(`Checking status for: ${targetUrl}`);

  // DANGER: Passing raw user input to exec() is a critical security flaw.
  exec(`curl -I ${targetUrl}`, (code, stdout, stderr) => {
    res.send(`
      <h2>Site Status Check</h2>
      <pre>${stdout}</pre>
      <p>Exit Code: ${code}</p>
    `);
  });
});

app.listen(port, () => {
  console.log(`Vulnerable app listening at http://localhost:${port}`);
});
