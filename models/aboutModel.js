const mongoose = require("mongoose");
const Joi = require("joi");

const aboutSchema = new mongoose.Schema({
    header: { type: String, default: "" },
    context: { type: String, default: "" },
    date_created: {
        type: Date, default: Date.now()
    }
});

exports.AboutModel = mongoose.model("abouts", aboutSchema);

exports.aboutValid = (_reqBody) => {
    let joiSchema = Joi.object({
        header: Joi.string().min(2).max(50).required(),
        context: Joi.string().min(2).max(10000).required(),
    });
    return joiSchema.validate(_reqBody);
}

