import axios from 'axios';

export const api = axios.create({
    baseURL: 'http://localhost:3005/api/v1', // Replace this with your API base URL
    timeout: 10000, // Optional timeout configuration
    headers: {
        'Content-Type': 'application/json', // Optional headers
    },
});
