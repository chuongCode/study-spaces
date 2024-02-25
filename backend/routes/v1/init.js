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
const dotenv = require('dotenv');
dotenv.config();
const Sequelize = require('sequelize');
const db = require('../../models');
const { group } = require('console');
const GroupQuizQuestion = db.GroupQuizQuestion;
const GroupQuiz = db.GroupQuiz;
const Group = db.Group;
const GroupContent = db.GroupContent;

init.get('/', async function (req, res, next) {
    res.json({
        version: 1.0,
        name: 'Express.js & Socket.io API boilerplate',
    });
});

init.get('/getGroups', async function (req, res, next) {
    const groups = await Group.findAll();
    res.json(groups);
    console.log(groups);
});

init.post('/createGroup', async function (req, res, next) {
    const { name } = req.body;
    const group = await Group.create({ name, status: 'inactive' });
    res.json(group);
    console.log(group);
});

// create group quiz then create groupquizquestions
init.get('/createTestQuiz', async function (req, res, next) {
    const quiz = await GroupQuiz.create({ groupId: 1 });

    const quizQuestion1 = await GroupQuizQuestion.create({
        quizId: quiz.id,
        question: 'Got Milk?',
        answers: ['Yes', 'No', 'Maybe'],
        correctAnswerIndex: 0,
    });
    const quizQuestion2 = await GroupQuizQuestion.create({
        quizId: quiz.id,
        question: 'Where is Waldo?',
        answers: ['Idk', 'Here!', 'There?'],
        correctAnswerIndex: 0,
    });
    const quizQuestion3 = await GroupQuizQuestion.create({
        quizId: quiz.id,
        question: 'What is in your wallet?',
        answers: ['CapitalOne', 'MasterCard', 'Visa'],
        correctAnswerIndex: 0,
    });
    const quizQuestion4 = await GroupQuizQuestion.create({
        quizId: quiz.id,
        question: 'Where is Kayla going to work?',
        answers: ['Ramp', 'LinkedIn', 'Brex'],
        correctAnswerIndex: 0,
    });
    const quizQuestion5 = await GroupQuizQuestion.create({
        quizId: quiz.id,
        question: 'Do you know the way?',
        answers: ['I kno de wae', 'No', 'What is the way?'],
        correctAnswerIndex: 0,
    });

    res.json(quiz);
    console.log(quiz);
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
