const express = require('express');
const app = express();
const port = 3000;

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});

app.get('/contato', (req, res) => {
  res.sendFile(__dirname + '/views/contato.html');
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
