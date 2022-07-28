const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const routes = express.Router();

// Require User Model
const User = require('../models/User');

routes.get('/', async (req, res) => {
    res.send("Hello!! Welcome to the Page!!");
});

// Registered Route
routes.post('/register',async(req, res) => {
    try {
        const { name, email, phone, work, password, confirm_password } = req.body;
        if (!name || !email || !phone || !work || !password || !confirm_password) {
            return res.status(422).json({ error: "Please fill the required fields!!" });
        }
        const userExist = await User.findOne({ email: email });
        if (userExist) {
            return res.status(422).json({ error: "Email already Exist!!" });
        } else if (password != confirm_password) {
            return res.status(422).json({ error: "Passwords are not Matched!!" });
        } else {
            const user = new User({ name, email, phone, work, password, confirm_password });
            user.save();
            res.status(201).json({ success: "User Successfully Registered!!" });
        }
    } catch (error) {
        console.log(error);
    }
});

// Login Router
routes.post('/signin', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: "Email and Password are Required!!" });
        }
        const userData = await User.findOne({ email: email });
        if (userData) {
            const isMatch = await bcrypt.compare(password, userData.password);     // Matching the Hash password
            const token = await userData.generateAuthToken();                      // Generate JWT Token
            console.log(token);
            res.cookie('jwtoken', token, {
                expires: new Date(Date.now() + 25892000000),
                httpOnly: true
            });
            if (!isMatch) {
                return res.status(400).json({ error: "Invalid Email & Password!!" });
            } else {
                res.status(200).json({ success: "User Login Successfully!!" });
            }
        } else {
            return res.status(400).json({ error: "Invalid Credentials!" });
        }
    } catch (error) {
        console.log(error);
    }
});

routes.get('/about', (req,res) => {
    res.cookie('jwtoken', "Mayank");
    res.send("Welcome to the About us Page!!");
});
module.exports = routes;