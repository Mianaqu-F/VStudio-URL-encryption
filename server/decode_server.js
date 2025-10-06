// cara pakai: npm init -y
// npm install express crypto-js
const express = require('express');
const CryptoJS = require('crypto-js');
const app = express();

const PORT = process.env.PORT || 3000;
const SECRET = process.env.SECRET_KEY || 'secret123!'; // jangan hardcode di production

app.get('/profile', (req, res) => {
  const uid = req.query.uid;
  if (!uid) {
    return res.send(`Plain params: id=${req.query.id || ''} name=${req.query.name || ''}`);
  }
  try {
    // uid biasanya sudah URL-decoded oleh express
    const bytes = CryptoJS.AES.decrypt(uid, SECRET);
    const original = bytes.toString(CryptoJS.enc.Utf8);
    const parsed = JSON.parse(original);
    res.send(`Decrypted on server: ${JSON.stringify(parsed)}`);
  } catch (e) {
    res.status(400).send('Failed to decrypt. ' + e.message);
  }
});

app.listen(PORT, ()=>console.log(`Server running on http://localhost:${PORT}`));
