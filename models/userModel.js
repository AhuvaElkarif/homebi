const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: String,
    password: String,
    phone: String,
    numApartment: Number,
    status:Boolean,
    nameCompany:String,
    date_created: {
        type: Date, default: Date.now()
    }
});

exports.UserModel = mongoose.model("users", userSchema);

exports.userValid = (_reqBody) => {
    let joiSchema = Joi.object({
        firstName: Joi.string().min(2).max(50).required(),
        lastName: Joi.string().min(2).max(50).required(),
        email: Joi.string().min(2).max(100).email().required(),
        password: Joi.string().min(6).max(50).required(),
        numApartment: Joi.number().min(0).required(),
        phone: Joi.string().min(9).max(10).required(),
    });
    return joiSchema.validate(_reqBody);
}

exports.genToken = (_userId) => {
    let token = jwt.sign({ _id: _userId }, "secret", { expiresIn: "60min" });
    return token;
}

exports.loginValid = (_reqBody) => {
    let joiSchema = Joi.object({
        email: Joi.string().min(2).max(100).email().required(),
        password: Joi.string().min(6).max(50).required()
    });
    return joiSchema.validate(_reqBody);
}

