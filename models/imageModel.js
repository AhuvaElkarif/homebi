const mongoose = require("mongoose");
const Joi = require("joi");

const imageSchema = new mongoose.Schema({
    buildId:String,
    image:String,
    date_created: {
        type: Date, default: Date.now()
    }
});

exports.ImageModel = mongoose.model("images", imageSchema);

exports.imageValid = (_reqBody) => {
    let joiSchema = Joi.object({
        image: Joi.string().min(2).max(50000).required(),
        buildId: Joi.string().required(),
    });
    return joiSchema.validate(_reqBody);
}
