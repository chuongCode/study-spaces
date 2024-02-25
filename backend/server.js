'use strict';
const express = require('express');
const app = express();
const http = require('http');
const cors = require('cors');
const session = require('express-session');
const db = require('./models');
const GroupQuizQuestion = db.GroupQuizQuestion;
const GroupQuiz = db.GroupQuiz;
const Group = db.Group;
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
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

let maxQuestion = 0;
let playersInGame = [];

io.on('connection', function (socket) {
    console.log(`Connection join (${socket.id})`);
    socket.on('connection', () => {
        console.log('Connection recieved');
    });

    socket.on('joinGame', async playerName => {
        if (!playersInGame.find(player => player.displayName === playerName)) {
            playersInGame.push({
                id: playersInGame.length,
                displayName: playerName,
                point: 0,
                currentQuestionIndex: 0,
            });
        }
    });

    socket.on('leaveGame', async playerName => {
        playersInGame = playersInGame.filter(player => player !== playerName);
    });

    socket.on('answer', async ({ name, isCorrect }) => {
        let isEnd = false;
        playersInGame = playersInGame.map(player => {
            if (player.displayName === name) {
                // last
                if (player.currentQuestionIndex === maxQuestion - 1) {
                    console.log('end game 1');

                    isEnd = true;
                    return {
                        ...player,
                        point: isCorrect ? player.point + 1 : player.point,
                        currentQuestionIndex: player.currentQuestionIndex,
                        isEnd: true,
                    };
                }

                return {
                    ...player,
                    point: isCorrect ? player.point + 1 : player.point,
                    currentQuestionIndex: player.currentQuestionIndex + 1,
                    isEnd: false,
                };
            }
            return player;
        });

        if (isEnd) {
            // every one end
            if (playersInGame.every(player => player?.isEnd === true)) {
                let highestPoint = -Infinity;
                playersInGame.forEach(player => {
                    if (player.point > highestPoint) {
                        highestPoint = player.point;
                    }
                });
                // Find all objects with the highest point value
                const playersWithHighestPoint = playersInGame.filter(player => player.point === highestPoint);
                if (playersWithHighestPoint.length > 1) {
                    io.sockets.emit('gameTie', playersWithHighestPoint.map(player => player.displayName).join(' '));
                } else {
                    io.sockets.emit('gameWon', playersWithHighestPoint[0].displayName);
                }
            } else {
                console.log('end game 2');
                socket.emit('gameEnd');
            }

            return;
        } else {
            io.sockets.emit('gameUpdate', playersInGame);
        }
    });

    socket.on('startGame', async groupId => {
        console.log('START GAME!!!');
        io.sockets.emit('loadingGame', 0);
        const callAIAboutContent = async groupId => {
            try {
                // Given group Id, get all the group content
                // stringify and send to prompt

                const paragraph1 = `Over the past five decades, spanning from 1974 to 2024, the world has undergone significant transformations. The period witnessed the end of the Cold War in the late 1980s, culminating with the dissolution of the Soviet Union in 1991. The 21st century saw the rise of globalization, accelerated by technological advancements, notably the widespread adoption of the internet since the 1990s. Major events such as the September 11 attacks in 2001 and the global financial crisis of 2008 reshaped geopolitics and economics. Technological innovations like the proliferation of smartphones, beginning with the launch of the iPhone in 2007, have revolutionized communication and daily life. Moreover, movements for civil rights and social justice, such as the Arab Spring starting in 2010 and the Black Lives Matter movement, have garnered global attention and sparked societal change. Challenges including climate change, economic inequality, and geopolitical tensions remain pressing issues as the world continues to navigate the complexities of the 21st century.`;

                const content = paragraph1;

                let questions = [];

                const prompt = addContentToPrompt(content);
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

                const contentRes = responseData.result.response;
                const question = contentRes.split('\n').slice(1);

                const questionsList = [];
                let count = 0;
                for (const q of question) {
                    count++;
                    io.sockets.emit('loadingGame', count);
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
                    const resContentQuestion = responseData2.result.response;
                    const parsedAnswers = resContentQuestion
                        .split('\n')
                        .slice(0)
                        .filter(
                            str =>
                                str.length > 0 &&
                                str !== "Sure, I'd be happy to help! Here is my answer to your question:"
                        )
                        .map(str => {
                            const description = str.replace(/\//g, '').replace(/"/g, '');
                            return description;
                        });
                    const thirdPrompt = addWrongQuestionToPrompt(q);

                    const response3 = await fetch(
                        `https://api.cloudflare.com/client/v4/accounts/${process.env.AccountID}/ai/run/@cf/meta/llama-2-7b-chat-int8`,
                        {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                Authorization: `Bearer ${API_TOKEN}`,
                            },
                            body: JSON.stringify({ prompt: thirdPrompt }),
                        }
                    );
                    const responseData3 = await response3.json();
                    const wrongs = responseData3.result.response
                        .split('\n')
                        .slice(2)
                        .filter(
                            str =>
                                str.length > 0 &&
                                str !== "Sure, I'd be happy to help! Here is my answer to your question:"
                        )
                        .map(str => {
                            const parts = str.split(/(?<=^\d+\.\s)/);
                            const description = parts[1].replace(/\//g, '').replace(/"/g, '');
                            return description;
                        });
                    const correctAnswer = parsedAnswers[0];
                    const answers = [...parsedAnswers, ...wrongs];

                    function shuffleArray(array) {
                        for (let i = array.length - 1; i > 0; i--) {
                            const j = Math.floor(Math.random() * (i + 1)); // Generate random index
                            [array[i], array[j]] = [array[j], array[i]]; // Swap elements
                        }
                        return array;
                    }
                    const newAnswers = shuffleArray(answers);
                    const correctAnswerIndex = newAnswers.findIndex(answer => answer === correctAnswer);
                    questionsList.push({ question: q, answers: newAnswers, correctAnswerIndex });
                }
                return questionsList;
            } catch (error) {
                console.error('Error calling AI worker:', error);
                return [];
            }
        };
        const questionList = await callAIAboutContent(groupId);

        const mockQuestion = [
            {
                question: '1. What was the significant event that occurred in 1991?',
                answers: [
                    'The Soviet Union collapsed.',
                    'The World Wide Web was invented.',
                    'The Hubble Space Telescope was launched.',
                    'The first text message was sent.',
                ],
                correctAnswerIndex: 0,
            },
            {
                question: '2. What technological innovation began to proliferate in the early 2000s?',
                answers: [
                    'Mobile phones with internet capabilities became widely available.',
                    'Social media platforms like Facebook and Twitter emerged.',
                    'Cloud computing and storage services gained popularity.',
                    'The use of artificial intelligence and machine learning in various industries began to increase.',
                ],
                correctAnswerIndex: 0,
            },
            {
                question: '3. What civil rights movement started in 2010?',
                answers: [
                    "The LGBTQ+ rights movement began in 2010 with the repeal of Don't Ask, Don't Tell.",
                    'The Black Lives Matter movement started in 2010 in response to the shooting of Trayvon Martin.',
                    'The #MeToo movement against sexual harassment and assault began in 2010 with the hashtag #YesAllWomen.',
                    'The Disability Rights movement gained momentum in 2010 with the passage of the Affordable Care Act.',
                ],
                correctAnswerIndex: 0,
            },
            {
                question: '4. What global challenge remains a pressing issue today?',
                answers: [
                    'Climate change continues to impact ecosystems worldwide.',
                    'Poverty and inequality persist in many regions.',
                    'Access to quality education and healthcare remains a challenge.',
                    'The COVID-19 pandemic continues to affect global economies and societies.',
                ],
                correctAnswerIndex: 0,
            },
            {
                question: '5. What geopolitical tension has been ongoing in the 21st century?',
                answers: [
                    'Tensions between Russia and Ukraine have been a major concern.',
                    'The Middle East conflict has been a persistent issue.',
                    "North Korea's nuclear program has caused geopolitical concerns.",
                ],
                correctAnswerIndex: 0,
            },
        ];

        maxQuestion = questionList.length;

        io.sockets.emit('initialGameData', { questions: questionList, createPlayerData: playersInGame });
    });

    socket.on('disconnect', () => console.log(`Connection left (${socket.id})`));
});

function addContentToPrompt(content) {
    const prompt = `You are an intelligent agent that creates questions based out of the topic of the contents that I give you. The questions should be able to be answers with one word.

Create 5 questions based off of this prompt using this content. Only give the string with the question.

${content}

`;
    return prompt;
}

function addWrongQuestionToPrompt(question) {
    const prompt = `You are an intelligent agent that creates 3 wrong, but on topic answers of this question that I give you. The answers should be one sentence only. The sentence should be brief under 5 words for each sentence.

    Create 3 wrong, but reasonable answers to this question:

    ${question}

`;
    return prompt;
}

function addQuestionToPrompt(question) {
    const prompt = `You are an intelligent agent that creates 1 answer to this question that I give you. The answers should be one sentence only. The sentence should be brief under 5 words for each sentence.

Create 1 answer based off of this question:

${question}

`;
    return prompt;
}
