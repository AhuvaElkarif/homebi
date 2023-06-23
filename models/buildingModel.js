const mongoose = require("mongoose");
const Joi = require("joi");
//do regex
const buildingSchema = new mongoose.Schema({
    entry: { type: Number, default: 1 },
    city: { type: String, default: "" },
    Street: { type: String, default: "" },
    zipCode: { type: String, default: "" },
    num: { type: Number, default: 1 },
    numApartments: { type: String, default: "" },
    paymentType: { type: Boolean, default: "" },
    paymentFees: { type: Number, default: "" },
    isCompany: { type: Boolean, default: "" },
    image: [{ type: String, default: "" }],
    video: [{ type: String, default: "" }],
    users: [mongoose.ObjectId],
    messages: [mongoose.ObjectId],
    complaints: [mongoose.ObjectId],
    workers: [mongoose.ObjectId],
    usersPayments: [mongoose.ObjectId],
    dateCreated: {
        type: Date, default: Date.now()
    }
});

exports.BuildingModel = mongoose.model("buildings", buildingSchema);

exports.buildingValid = (_reqBody) => {
    let joiSchema = Joi.object({
        entry: Joi.number().min(1).max(99),
        city: Joi.string().min(2).max(99),
        Street: Joi.string().min(2).max(99),
        zipCode: Joi.string().min(2).max(99),
        num: Joi.number().min(1).max(500),
        numApartment: Joi.string().regex(/^[1-9]\d*$/).required(),
        paymentType: Joi.boolean().required(),
        paymentFees: Joi.number().positive().required(),
        isCompany: Joi.boolean().required(),
    });
    return joiSchema.validate(_reqBody);
}

