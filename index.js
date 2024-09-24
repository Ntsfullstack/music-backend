require('dotenv').config();
const express = require('express');
const connection = require('./server');
const app = express();

// Kết nối tới cơ sở dữ liệu
connection().then(() => {
    console.log('Database connected successfully.');
}).catch((error) => {
    console.error('Database connection failed:', error.message);
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
