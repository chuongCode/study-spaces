const express = require('express');
const init = express.Router();
const multer = require('multer');
const uploadDirectory = './uploads';
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
});
const fs = require('fs');
const path = require('path');
const mammoth = require('mammoth');
const pdf = require('html-pdf');
const upload = multer({ storage });
const PDFParser = require('pdf-parse');

init.get('/', async function (req, res, next) {
    res.json({
        version: 1.0,
        name: 'Express.js & Socket.io API boilerplate',
    });
});

init.get('/test', async function (req, res, next) {
    res.json({
        version: 1.0,
        name: 'Express.js & Socket.io API boilerplate',
    });
});

init.post('/upload-pdf', upload.single('pdf'), async (req, res) => {
    try {
        // Check if a file was uploaded
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        // Retrieve the uploaded file from the request body
        const uploadedFile = req.file;

        // Write the file to the upload directory
        const fileName = `${uploadedFile.originalname}`;
        const filePath = `${uploadDirectory}/${fileName}`;
        const fileData = fs.readFileSync(filePath, 'utf8');
        await processFileData(fileData);

        // Determine the file type
        const fileExtension = uploadedFile.mimetype ? uploadedFile.mimetype : null;

        // Check if the file is already in PDF format
        if (fileExtension === 'application/pdf') {
            // Process the PDF directly
            await processPDF(filePath, res);
        } else {
            // Convert the file to PDF
            const convertedFilePath = await convertToPDF(filePath);

            // Process the converted PDF
            await processPDF(convertedFilePath, res);
        }
    } catch (error) {
        console.error('An error occurred while processing the file:', error);
        res.status(500).json({ error: 'Failed to process the file' });
    }
});

// Function to process the file data (perform your file processing logic here)
function processFileData(fileData) {
    fs.writeFile('output.txt', fileData, err => {
        if (err) {
            console.error('Error writing file:', err);
        } else {
            console.log('File written successfully');
        }
    });
}

// Function to process the PDF and count word occurrences
async function processPDF(pdfFilePath, res) {
    try {
        // Parse the PDF content
        const pdfBuffer = fs.readFileSync(pdfFilePath);
        const data = await PDFParser(pdfBuffer);
        const pdfText = data.text;
        res.json({ pdfText });
    } catch (error) {
        console.error('An error occurred while processing the PDF:', error);
        res.status(500).json({ error: 'Failed to process the PDF' });
    } finally {
        // Clean up - delete the uploaded file and PDF file if needed
    }
}

// Helper function to convert files to PDF using external converter
async function convertToPDF(filePath) {
    return new Promise((resolve, reject) => {
        const convertedFilePath = path.join('converted/', `${path.parse(filePath).name}.pdf`);

        mammoth
            .extractRawText({ path: filePath })
            .then(result => {
                const html = `<html><body>${result.value}</body></html>`;

                pdf.create(html).toFile(convertedFilePath, error => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(convertedFilePath);
                    }
                });
            })
            .catch(error => {
                reject(error);
            });
    });
}
module.exports = init;
