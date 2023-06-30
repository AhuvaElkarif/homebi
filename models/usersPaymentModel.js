const mongoose = require("mongoose");
const Joi = require("joi");

const usersPaymentSchema = new mongoose.Schema({
    price: { type: Number, default: 0 },
    isPay: { type: Boolean, default: false },
    dateCreated: { type: Date, default: Date.now() },
    userId: {type:mongoose.ObjectId, default:null},
    status: { type: Boolean, default: true },
    buildId: { type: mongoose.ObjectId, default: null },
});

exports.UsersPaymentModel = mongoose.model("usersPayments", usersPaymentSchema);

exports.usersPaymentrValid = (_reqBody) => {
    let joiSchema = Joi.object({
        price: Joi.number().max(5000).required(),
        isPay: Joi.boolean().required(),
        buildId: Joi.string().required(),
        dateCreated: Joi.date().allow(null, ''),
    });
    return joiSchema.validate(_reqBody);
}

