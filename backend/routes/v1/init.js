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
        const test =
            'Team Development 5 team roles * Design Team Lead (DTL) * Ensure organization needs are met and on time * If someone is falling behind/not meeting standards… talk to them * Responsible for quality of client’s engagement * Design team lead is a senior designer - regardless of discipline and has exposures to others * Team lead is sufficiently involved to understand what’s going on * There is no separation of business responsibility and design responsibilities * Understand POV of each discipline * Not fully invested in project * Develops initial research plan - done in consultation with the rest of the team * Works closely with visual and industrial designers on how the visual and physical design communicates system’s behavior * Relative importance of information of the behavior of widgets and physical controls * Reviews design documentation developed by IxD synthesizer';
        const prompt = `You are an intelligent agent that creates multiple choice questions based out of the topic of the contents that I give you.

You should generate one question, and 4 possible multiple choice answers that could answer the question. One of the answers should be the only correct answer. Lastly, from the answers you create say the letter of the correct answer.Give the generated question as <question>. On the next line list the four possible multiple choice answers from letters A to D respectively. On the last line, give the correct answer letter as 'Correct Option is: <letter>' ending with '@@'.


Follow this format to showcase the question:
The question and possible answers should be maximum 50 words. Try and relax and work on generating this question step by step:
Question: <question>
A. <multiple choice answer>
B. <multiple choice answer>
C. <multiple choice answer>
D. <multiple choice answer>
Correct Option is <letter>
End the answer with '@@' to indicate the end of the answer.

#### Example ####
Content: Nonrenewable energy resources include coal, natural gas, oil, and nuclear energy. Once these resources are used up, they cannot be replaced, which is a major problem for humanity as we are currently dependent on them to supply most of our energy needs.

Question: What is an example of non renewable energy?
Options: 
(A) Coal
(B) Solar Energy
(C) Wind turbine energy 
(D) Crops
Correct Answer: A@@
#################
This time when I give you the content. Generate 5 sets of multiple choice question and answers in the example format above.

Content: ${test}
`;

        console.log(req.body.content);

        // Read the content of the text file containing the prompt
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
        const groupId = req.body.groupId;
        //make api call to get content
        //const content = await GroupContent.findOne({ where: { groupId: groupId } });

        //Create a GroupQuizQuestion with the response and groupId

        res.json(responseData);
    } catch (error) {
        console.error('Error calling AI worker:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = init;
