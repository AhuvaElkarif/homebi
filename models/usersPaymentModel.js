const mongoose = require("mongoose");
const Joi = require("joi");

const usersPaymentSchema = new mongoose.Schema({
    price: { type: Number, default: 0 },
    isPay: { type: Boolean, default: false },
    dateCreated: { type: Date, default: Date.now() },
    userId: {type:mongoose.ObjectId, default:null},
    status: { type: Boolean, default: true }
});

exports.UsersPaymentModel = mongoose.model("usersPayments", usersPaymentSchema);

exports.usersPaymentrValid = (_reqBody) => {
    let joiSchema = Joi.object({
        price: Joi.number().max(5000).required(),
        isPay: Joi.boolean().required(),
        dateCreated: Joi.date().allow(null, ''),
    });
    return joiSchema.validate(_reqBody);
}

