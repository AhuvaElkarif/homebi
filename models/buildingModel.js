const mongoose = require("mongoose");
const Joi = require("joi");

const buildingSchema = new mongoose.Schema({
    numEntry: { type: Number, default: 1 },
    city: { type: String, default: "" },
    street: { type: String, default: "" },
    zipCode: { type: String, default: "" },
    num: { type: Number, default: 1 },
    lat: { type: Number, default: 0 },
    lng: { type: Number, default: 0 },
    balance : {type:Number, default:0},
    numApartments: { type: Number, default: 0 },
    description: { type: String, default: "" },
    paymentType: { type: Boolean, default: "" },
    paymentFees: { type: Number, default: "" },
    userId: {type:mongoose.ObjectId, default:null},
    images: [{ type: String, default: "" }],
    users: [mongoose.ObjectId],
    expenses: [mongoose.ObjectId],
    messages: [mongoose.ObjectId],
    complaints: [mongoose.ObjectId],
    usersPayments: [mongoose.ObjectId],
    dateCreated: { type: Date, default: Date.now() }
});

exports.BuildingModel = mongoose.model("buildings", buildingSchema);

exports.buildingValid = (_reqBody) => {
    let joiSchema = Joi.object({
        lat: Joi.number().required(),
        lng: Joi.number().required(),
        balance: Joi.number().allow(null,0),
        numEntry: Joi.number().max(99),
        city: Joi.string().min(2).max(99),
        street: Joi.string().min(2).max(99),
        zipCode: Joi.string().min(2).max(99),
        num: Joi.number().min(1).max(500),
        numApartments: Joi.number().required(),
        description: Joi.string().required(),
        paymentType: Joi.boolean().required(),
        paymentFees: Joi.number().positive().required(),
        images: Joi.array().allow(null, ''),
        _id: Joi.string().allow(null, ''),
    });
    return joiSchema.validate(_reqBody);
}

