const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    name:{type: String, required: true},
    email:{type: String, required: true},
    phone:{type: Number, required: true},
    work:{type: String, required: true},
    password:{type: String, required: true},
    confirm_password: { type: String, required: true },
    tokens: [
        {
            token: {
                type: String, required: true
            }
        }
    ]
});

// We are Hashing the password
userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 12);
        this.confirm_password = await bcrypt.hash(this.confirm_password, 12);
        next();
    }
});

// We are Generating the JWT token
userSchema.methods.generateAuthToken = async function () {
    try {
        let generateToken = await jwt.sign({ _id: this._id }, process.env.SECRET_KEY);
        this.tokens = this.tokens.concat({ token: generateToken });
        await this.save();
        return generateToken;
    } catch (error) {
        console.log(error);
    }
};

const User = mongoose.model('USER',userSchema);

module.exports = User;