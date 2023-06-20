const mongoose = require("mongoose");
const Joi = require("joi");

const complaintSchema = new mongoose.Schema({
    userId:  { type: mongoose.ObjectId, default: null },
    buildId: String,
    description: String,
    image: String,
    video: String,
    isHandled: {
        type: Boolean, default: false
    },
    status: {
        type: Boolean, default: true
    },
    date_created: {
        type: Date, default: Date.now()
    }
});

exports.ComplaintModel = mongoose.model("complaints", complaintSchema);

exports.complaintValid = (_reqBody) => {
    let joiSchema = Joi.object({
        description: Joi.string().min(2).max(1000).required(),
        image: Joi.string().min(2).max(50000).allow(null, ''),
        video: Joi.string().min(2).max(10000).allow(null, ''),
        buildId: Joi.string().required(),
    });
    return joiSchema.validate(_reqBody);
}

