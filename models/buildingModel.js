const mongoose = require("mongoose");
const Joi = require("joi");
//do regex
const buildingSchema = new mongoose.Schema({
    city: String,
    street: String,
    numHouse: String,
    numEntry: String,
    zipCode: String,
    numApartments: String,
    paymentType: Boolean,
    paymentFees: Number,
    userId:String,
    isCompany:Boolean,
    date_created: {
        type: Date, default: Date.now()
    }
});

exports.BuildingModel = mongoose.model("buildings", buildingSchema);

exports.buildingValid = (_reqBody) => {
    let joiSchema = Joi.object({
        city: Joi.string().min(2).max(50).required(),
        street: Joi.string().min(2).max(50).required(),
        numHouse: Joi.string().numeric().positive().max(4).required(),
        numEntry: Joi.string().numeric().positive().max(2).required(),
        zipCode: Joi.string().numeric().positive().max(20).required(),
        numApartment: Joi.string().numeric().positive().max(0).required(),
        paymentType: Joi.boolean().required(),
        paymentFees: Joi.number().positive().required(),
        isCompany: Joi.boolean().required(),
    });
    return joiSchema.validate(_reqBody);
}

