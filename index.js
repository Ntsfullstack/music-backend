require('dotenv').config();
require('express-async-errors');
const express = require('express');
const cors = require('cors');
const connection = require('./server');
const userRoutes = require("./routes/users");
const authRoutes = require("./routes/auth");
const songRoutes = require("./routes/songs");
const app = express();

// Kết nối tới cơ sở dữ liệu
connection();
app.use(cors());
app.use(express.json());
app.use('/api/users', userRoutes);
app.use('/api/login', authRoutes);
app.use('/api/songs', songRoutes);
const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
