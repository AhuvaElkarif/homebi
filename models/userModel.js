const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const { config } = require("../config/secret");

const userSchema = new mongoose.Schema({
    fullName: {
        firstName: { type: String, default: "" },
        lastName: { type: String, default: "" }
    },
    email: { type: String, default: "" },
    password: { type: String, default: "" },
    phone: { type: String, default: "" },
    numApartment: { type: Number, default: 0 },
    status: { type: Boolean, default: true },
    role: { type: String, default: "user" },
    area: { type: Number, default: 0 },
    price: { type: Number, default: 0 },
    usersPayments: [mongoose.ObjectId],
    active: { type: Boolean, default: true },
    buildId: { type: mongoose.ObjectId, default: null },
    date_created: { type: Date, default: Date.now() }
});

exports.UserModel = mongoose.model("users", userSchema);

exports.userValid = (_reqBody) => {
    let joiSchema = Joi.object({
        fullName: {
            firstName: Joi.string().min(2).max(50).required(),
            lastName: Joi.string().min(2).max(50).required(),
        },
        email: Joi.string().email().required(),
        password: Joi.string().regex(/^(?=.*[A-Za-z])(?=.*\d).{6,}$/).allow(null),
        numApartment: Joi.number().min(0).required(),
        area: Joi.number().min(10).allow(null),
        phone: Joi.string().min(9).max(10).required(),
        price: Joi.number().min(0).required(),
        active: Joi.boolean().allow(null),
        _id: Joi.string().allow(null),
    });
    return joiSchema.validate(_reqBody);
}

exports.genToken = (_userId, _role) => {
    let token = jwt.sign({ _id: _userId, role: _role }, config.tokenSecretDb, { expiresIn: "30days" });
    return token;
}

exports.loginValid = (_reqBody) => {
    let joiSchema = Joi.object({
        email: Joi.string().min(2).max(100).email().required(),
        password: Joi.string().regex(/^(?=.*[A-Za-z])(?=.*\d).{6,}$/).required()
    });
    return joiSchema.validate(_reqBody);
}

exports.registerValid = (_reqBody) => {
    let joiSchema = Joi.object({
        email: Joi.string().email().required(),
        numApartment: Joi.number().min(0).required(),
        buildId: Joi.string().required(),
    });
    return joiSchema.validate(_reqBody);
}

