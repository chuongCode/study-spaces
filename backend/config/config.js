require('dotenv').config();

const config = {
    development: {
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
        host: process.env.DB_HOST,
        dialect: 'mysql',
        port: process.env.DB_PORT,
        sslmode: 'REQUIRED',
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false,
                ca: './ca-certificate.crt',
            },
        },
    },
    test: {
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
        host: process.env.DB_HOST,
        dialect: 'mysql',
        port: process.env.DB_PORT,
        sslmode: 'REQUIRED',
    },
    production: {
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
        host: process.env.DB_HOST,
        dialect: 'mysql',
        port: process.env.DB_PORT,
        sslmode: 'REQUIRED',
    },
};

module.exports = config;
