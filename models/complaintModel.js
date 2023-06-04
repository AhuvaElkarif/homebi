const mongoose = require("mongoose");
const Joi = require("joi");

const complaintSchema = new mongoose.Schema({
    userId: String,
    buildId:String,
    deacription: String,
    image:String,
    video:String,
    isHandled:Boolean,
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
        deacription: Joi.string().min(2).max(1000).required(),
        image: Joi.string().min(2).max(50000).required(),
        video: Joi.string().min(2).max(10000).required(),
        isHandled: Joi.boolean().required(),
    });
    return joiSchema.validate(_reqBody);
}

