const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");

const typeProffesionModel = new mongoose.Schema({
    type_proffesion: { type: String, default: "" },
    date_created: { type: Date, default: Date.now() }
});

exports.UserModel = mongoose.model("expenes", complaintSchema);

exports.userValid = (_reqBody) => {
    let joiSchema = Joi.object({
        type_proffesion: Joi.string().min(2).max(50).required(),
        street: Joi.string().min(2).max(50).required(),
        numHouse: Joi.string().min(2).max(100).email().required(),
        numEntry: Joi.string().min(6).max(50).required(),
        numApartment: Joi.number().required(),
        phone: Joi.string().min(9).max(10).required(),
        paymentType: Joi.boolean().min(9).max(10).required(),
    });
    return joiSchema.validate(_reqBody);
}

exports.genToken = (_userId) => {
    let token = jwt.sign({ _id: _userId }, "secret", { expiresIn: "60min" });
    return token;
}

