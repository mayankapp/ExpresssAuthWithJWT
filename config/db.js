const mongoose = require('mongoose');

const url = process.env.DATABASE;

module.exports = (() => {
    mongoose.connect(url);
});