'use strict';
const express = require('express');
const app = express();
const http = require('http');
const cors = require('cors');
const session = require('express-session');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const expressSwagger = require('express-swagger-generator')(app);
const srvConfig = require('./config');
const { CONNECTION_TYPE, DB_HOST, DB_USERNAME, DB_PASSWORD, DB_PORT, DB_NAME, DB_QUERY_PARAMS } = srvConfig;
const dbAuthString = DB_USERNAME && DB_PASSWORD ? `${srvConfig.DB_USERNAME}:${srvConfig.DB_PASSWORD}@` : '';
const fetch = require('node-fetch');

let httpServer;

/**
 * Configure middleware
 */
app.use(
    cors({
        // origin: `http://localhost:${srvConfig.SERVER_PORT}`,
        origin: function (origin, callback) {
            return callback(null, true);
        },
        optionsSuccessStatus: 200,
        credentials: true,
    }),
    session({
        saveUninitialized: true,
        secret: srvConfig.SESSION_SECRET,
        resave: true,
    }),
    cookieParser(),
    bodyParser.json()
);

/**
 * Include all API Routes
 */
app.use('/api', require('./routes/api'));

/**
 * Swagger UI documentation
 */
if (srvConfig.SWAGGER_SETTINGS.enableSwaggerUI) expressSwagger(srvConfig.SWAGGER_SETTINGS);

/**
 * Configure http(s)Server
 */
if (srvConfig.HTTPS_ENABLED) {
    const privateKey = fs.readFileSync(srvConfig.PRIVATE_KEY_PATH, 'utf8');
    const certificate = fs.readFileSync(srvConfig.CERTIFICATE_PATH, 'utf8');
    const ca = fs.readFileSync(srvConfig.CA_PATH, 'utf8');

    // Create a HTTPS server
    httpServer = https.createServer({ key: privateKey, cert: certificate, ca: ca }, app);
} else {
    // Create a HTTP server
    httpServer = http.createServer({}, app);
}

/**
 * Start http server & connect to MongoDB
 */
httpServer.listen(srvConfig.SERVER_PORT, () => {
    console.log(`Server started on port ${srvConfig.SERVER_PORT}`);
});

/**
 * Socket.io section
 */
const io = require('socket.io')(httpServer, {
    cors: {
        origin: 'http://localhost:3000',
        path: '/socket',
    },
});

io.on('connection', function (socket) {
    console.log(`Connection join (${socket.id})`);
    socket.on('connection', () => {
        console.log('Connection recieved');
    });

    // given a room ID, make a connection to the room
    socket.on('join', roomId => {});

    const quizId = '1';

    socket.on('startGame', async groupId => {
        socket.emit('Game loading');
        const questionList = await callAIAboutContent(groupId);
    });

    socket.on('disconnect', () => console.log(`Connection left (${socket.id})`));
});

const callAIAboutContent = async groupId => {
    try {
        // get groupId from req
        // get content from GroupContent where groupId = groupId
        // create a promt from the content : "The content of the group is: " + content
        // send the prompt to the AI
        // send the response to the client
        // create a GroupQuiz with the response and groupId (store the response in the database for future use)

        const paragraph1 = `Over the past five decades, spanning from 1974 to 2024, the world has undergone significant transformations. The period witnessed the end of the Cold War in the late 1980s, culminating with the dissolution of the Soviet Union in 1991. The 21st century saw the rise of globalization, accelerated by technological advancements, notably the widespread adoption of the internet since the 1990s. Major events such as the September 11 attacks in 2001 and the global financial crisis of 2008 reshaped geopolitics and economics. Technological innovations like the proliferation of smartphones, beginning with the launch of the iPhone in 2007, have revolutionized communication and daily life. Moreover, movements for civil rights and social justice, such as the Arab Spring starting in 2010 and the Black Lives Matter movement, have garnered global attention and sparked societal change. Challenges including climate change, economic inequality, and geopolitical tensions remain pressing issues as the world continues to navigate the complexities of the 21st century.`;

        const content = paragraph1;

        let questions = [];

        const prompt = addContentToPrompt(content);
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
        console.log(responseData);

        const contentRes = responseData.result.response;
        const question = contentRes.split('\n').slice(1);

        const questionsList = [];
        for (const q of question) {
            console.log('question to be answered:  ' + q);
            const secondPrompt = addQuestionToPrompt(q);

            const response2 = await fetch(
                `https://api.cloudflare.com/client/v4/accounts/${process.env.AccountID}/ai/run/@cf/meta/llama-2-7b-chat-int8`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${API_TOKEN}`,
                    },
                    body: JSON.stringify({ prompt: secondPrompt }),
                }
            );
            const responseData2 = await response2.json();
            console.log(responseData2);
            const resContentQuestion = responseData2.result.response;
            const parsedAnswers = resContentQuestion
                .split('\n')
                .slice(2)
                .filter(str => str.length > 0)
                .map(str => {
                    const parts = str.split(/(?<=^\d+\.\s)/);
                    const description = parts[1].replace(/\//g, '').replace(/"/g, '');
                    return description;
                });
            questionsList.push({ question: q, answers: parsedAnswers });
            console.log(parsedAnswers);
        }

        return questionsList;
    } catch (error) {
        console.error('Error calling AI worker:', error);
        return [];
    }
};

function addContentToPrompt(content) {
    const prompt = `You are an intelligent agent that creates questions based out of the topic of the contents that I give you. The questions should be able to be answers with one word.

Create 5 questions based off of this prompt using this content. Only give the string with the question.

${content}

`;
    return prompt;
}

function addQuestionToPrompt(question) {
    const prompt = `You are an intelligent agent that creates 4 answers of this question that I give you. The answers should be one sentence only. The sentence should be brief under 5 words for each sentence.

Create 4 answers based off of this question:

${question}

`;
    return prompt;
}
