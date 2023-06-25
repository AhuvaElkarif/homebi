const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");

const videoSchema = new mongoose.Schema({
    buildId: String,
    video: String,
    dateCreated: {
        type: Date, default: Date.now()
    },
    status:{
        type: Boolean, default: true
    }


});

exports.VideoModel = mongoose.model("videos", videoSchema);

exports.videoValid = (_reqBody) => {

    let joiSchema = Joi.object({
        buildId:Joi.string().required(),
        video: Joi.string().min(2).max(50000).required()
    });
    return joiSchema.validate(_reqBody);
}



