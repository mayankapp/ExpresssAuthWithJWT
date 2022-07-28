const dotenv = require('dotenv');
const express = require('express');
const app = express();

dotenv.config({ path: "./config.env" });
const PORT = process.env.PORT || 3000;

// Database Configuration
const connect = require('./config/db');

app.use(express.json());

// Route Configuration
app.use(require('./routes/auth'));


app.listen(PORT, async () => {
    await connect()
    console.log(`Server is Running at port : ${PORT}`);
});