const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");

const imagesSchema = new mongoose.Schema({
    build_id:String,
    image:String,
    date_created: {
        type: Date, default: Date.now()
    }
});

exports.ImageMoel = mongoose.model("images", imagesSchema);

exports.userValid = (_reqBody) => {
    let joiSchema = Joi.object({
        image: Joi.string().min(2).max(50000).required(),
    });
    return joiSchema.validate(_reqBody);
}

exports.genToken = (_userId) => {
    let token = jwt.sign({ _id: _userId }, "secret", { expiresIn: "60min" });
    return token;
}

