const mongoose = require("mongoose");
const Joi = require("joi");

const workerSchema = new mongoose.Schema({
    bulidId:String,
    phone: String,
    // האם צריך גם לערך הזה לעשות תקינות?
    typeProffesionId: String,
    name:String,
    email:String,
    dateCreated: {
        type: Date, default: Date.now()
    },
    status:{
        type: Boolean, default: true
    }
});

exports.WorkerModel = mongoose.model("workers", workerSchema);

exports.workerValid = (_reqBody) => {
    let joiSchema = Joi.object({
        name: Joi.string().min(2).max(50).required(),
        phone: Joi.string().min(9).max(10).required(),
        email: Joi.email().required(),
        typeProffesionId:Joi.string().required(),
        bulidId:Joi.string().required()


    });
    return joiSchema.validate(_reqBody);
}


