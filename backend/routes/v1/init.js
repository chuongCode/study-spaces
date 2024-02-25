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
const fetch = require('node-fetch');
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

init.post('/ai-request', async (req, res) => {
    try {
        // get groupId from req
        // get content from GroupContent where groupId = groupId
        // create a promt from the content : "The content of the group is: " + content
        // send the prompt to the AI
        // send the response to the client
        // create a GroupQuiz with the response and groupId (store the response in the database for future use)

        const paragraph1 = `Within the spectrum of design roles, the Visual Designer (VisD) occupies a unique position, where aesthetic appeal converges with functional efficacy. Their primary objective is to imbue products with intuitive and appealing visual cues that enhance usability and desirability. Armed with a deep understanding of graphic design fundamentals, the VisD navigates the intricate interplay between form and function, striving for maximum coherence and impact. Their responsibilities extend beyond mere ornamentation, encompassing the articulation of visual design requirements and the development of a cohesive visual system. By proposing and refining visual strategies, the VisD ensures consensus among team members, aligning design decisions with broader project objectives. Furthermore, their keen eye for detail enables them to identify and rectify inconsistencies, thereby fostering a harmonious visual language that resonates with users on a profound level.`;

        const content = paragraph1;

        let questions = [];
        for (let i = 0; i < 5; i++) {
            const prompt = addContentToPrompt(
                content,
                questions.map(question => question.question)
            );
            console.log('prompt added!');
            console.log(prompt);
            const API_TOKEN = process.env.API_KEY;
            const response = await fetch(
                `https://api.cloudflare.com/client/v4/accounts/${process.env.AccountID}/ai/run/@cf/meta/llama-2-7b-chat-int8`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${API_TOKEN}`,
                    },
                    body: JSON.stringify({ prompt }),
                }
            );
            if (!response.ok) {
                throw new Error('Failed to fetch AI response');
            }
            const responseData = await response.json();
            console.log(i);
            console.log(responseData);

            const [matches] = extractStrings(responseData.result.response);
            console.log(matches);
            if (!matches) {
                console.log('input not given');
            } else {
                const question = parseQuestion(matches);
                questions.push(question);
            }
            await sleep(300);
        }
        console.log('final questions');
        console.log('questions');
        res.json(questions);
    } catch (error) {
        console.error('Error calling AI worker:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function addContentToPrompt(content, questions) {
    const prompt = `You are an intelligent agent that creates multiple choice questions based out of the topic of the contents that I give you.

You are given a list of previous questions. Generate a unique question not listed in next to "Do not repeat these questions when generating the new question:". Also generate and 4 possible multiple choice answers that could answer the question. One of the answers should be the only correct answer. Lastly, from the answers you create say the letter of the correct answer. Give the unique generated question not mentioned next to "Do not repeat these questions when generating the new question" as <question>. On the next line list the four possible multiple choice answers from letters A to D respectively. On the last line, give the correct answer letter as 'Correct Option is: <letter>' ending with '@@'. You will also be given a list of previous questions you have written in the past. Do not repeat these questions come up with a unique question to ask the user.

Create 5 questions based off of this prompt

`;
    return prompt;
}

function parseQuestion(input) {
    // Split the input into lines
    const lines = input.split('\n');

    // Extract the question
    const question = lines[0].trim().split(': ')[1];

    // Extract the options
    const options = [];
    for (let i = 1; i <= 4; i++) {
        options.push(lines[i].trim().substring(3));
    }

    // Extract the correct option index
    let correctOptionIndex;
    const correctOptionLine = lines.find(line => line.includes('Correct Option is:'));
    if (correctOptionLine) {
        const correctOptionLetter = correctOptionLine.trim().split(': ')[1].trim();
        correctOptionIndex = correctOptionLetter.charCodeAt(0) - 'A'.charCodeAt(0);
    }

    // Return the parsed data
    return {
        question: question,
        options: options,
        correctOptionIndex: correctOptionIndex,
    };
}

function extractStrings(input) {
    var matches = [];
    var startIndex = 0;
    var endIndex = 0;

    while (startIndex !== -1 && endIndex !== -1) {
        startIndex = input.indexOf('@@', endIndex);
        if (startIndex !== -1) {
            endIndex = input.indexOf('@@', startIndex + 2);
            if (endIndex !== -1) {
                matches.push(input.substring(startIndex + 2, endIndex));
            }
        }
    }

    return matches;
}

module.exports = init;
