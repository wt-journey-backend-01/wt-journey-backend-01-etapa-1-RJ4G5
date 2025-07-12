const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true }));


function carregarTemplateComDados(bodyContent) {
  try {
    const path_template = path.join(__dirname, 'views', 'template.html');
    let html = fs.readFileSync(path_template, 'utf8');

    html = html.replace('<div class="main-body"></div>', `<div class="main-body">${bodyContent}</div>`);
    return html;
  } catch (error) {
    console.error('Erro ao carregar o template:', error);
    return null;
  }
}

app.get('/', (req, res) => {
  res.status(200).sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/contato', (req, res) => {
  res.status(200).sendFile(path.join(__dirname, 'views', 'contato.html'));
});


app.post('/contato', (req, res) => {
  const { nome, email, assunto, mensagem } = req.body;
  res.redirect(`/contato-recebido?nome=${nome}&email=${email}&assunto=${assunto}&mensagem=${mensagem}`);
});


app.get('/contato-recebido', (req, res) => {
  const { nome, email, assunto, mensagem } = req.query;
  if (!nome || !email || !assunto || !mensagem) {
    return res.status(400).send('Sem parâmetros');
  }

  const bodyContent = `
        <div class="reposta-servidor">
          <h1>Obrigado pelo seu contato!</h1>
          <p><strong>Nome:</strong> ${nome}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Assunto:</strong> ${assunto}</p>
          <p><strong>Mensagem:</strong> ${mensagem}</p>
        </div>
       
    `;
  const htmlModificado = carregarTemplateComDados(bodyContent);

  if (htmlModificado) {
    res.status(200).send(htmlModificado);
  } else {
    res.status(500).send('Erro intrno do servidor. Contate o suporte');
  }
});



app.get('/sugestao', (req, res) => {
  const { nome, ingredientes } = req.query;
  if (!nome || !ingredientes) {
    return res.status(400).send('Sem parâmetros');
  }
  const bodyContent = `
    <div class="reposta-servidor">
      <h1>Obrigado pela sua sugestão!</h1>
      <p>Nome do lanche: ${nome}</p>
      <p>Ingredientes: ${ingredientes}</p>
    </div>
    
  `;

  const htmlModificado = carregarTemplateComDados(bodyContent);

  if (htmlModificado) {
    res.status(200).send(htmlModificado);
  } else {
    res.status(500).send('Erro intrno do servidor. Contate o suporte');
  }


});


app.get('/api/lanches', (req, res) => {
  const filePath = path.join(__dirname, 'public', 'data', 'lanches.json');
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Problema interno do servidor. Contate o suporte' });
    }
    try {
      const lanches = JSON.parse(data);
      res.status(200).json(lanches);
    } catch (parseErr) {
      res.status(500).json({ error: 'Problema interno do servidor. Contate o suporte' });
    }
  });
});


app.use(express.static('public'));


app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
