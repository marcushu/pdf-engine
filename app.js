const express = require('express');
const { PdfObj } = require('./js/pdfObj');

const app = express();

//

app.get('/', (req, res) => {
  res.send("post with instruction array to /pdf")
})


// Create and return a pdf document from an array
// of instruction objects available through the 
// request body.
/////////////////////////////////////////////////

app.post('/pdf', express.json(), async (req, res) => {
  const reqBody = req.body;

  try {
    let pdfBuilder = new PdfObj(reqBody);

    const newPdf = await pdfBuilder.createPDF();

    const stream = newPdf.pipe(res);

    stream.on('finish', () => res.send());
    
  } catch (err) {
    console.error(err);

    res.status(500)
    res.send(err);
  }

})


app.listen(process.env.PORT || 3000, () => {
  console.log('Listening...')
})
