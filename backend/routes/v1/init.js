const express = require('express');
const init = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const PDFParser = require('pdf-parse');

init.get("/", async function (req, res, next) {
    res.json({
        'version': 1.0,
        'name': 'Express.js & Socket.io API boilerplate'
    });
});


init.get("/test", async function (req, res, next) {
    res.json({
        'version': 1.0,
        'name': 'Express.js & Socket.io API boilerplate'
    });
});

init.post('/upload-pdf', upload.single('pdf'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Parse the uploaded PDF file
    const pdfBuffer = req.file.buffer;
    const pdfData = await PDFParser(pdfBuffer);

    // Log the contents of the PDF
    console.log('PDF Contents:', pdfData.text);

    res.status(200).json({ message: 'PDF uploaded and parsed successfully' });
  } catch (error) {
    console.error('Error uploading/parsing PDF:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = init
