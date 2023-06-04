const mongoose = require("mongoose");
const Joi = require("joi");

const messageSchema = new mongoose.Schema({
    description: String,
    status:String,
    buildId:String,
    status: {
        type: Boolean, default: true
    },
    date_created: {
        type: Date, default: Date.now()
    }
});

exports.MessageModel = mongoose.model("messages", messageSchema);

exports.messageValid = (_reqBody) => {
    let joiSchema = Joi.object({
        description: Joi.string().min(2).max(50000).required(),
        status: Joi.boolean.required(),
        buildId: Joi.string().required(),
    });
    return joiSchema.validate(_reqBody);
}

