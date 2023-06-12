const mongoose = require("mongoose");
const Joi = require("joi");

const usersPaymentSchema = new mongoose.Schema({
    userId: String,
    price:Number,
    isPay:Boolean,
    datCreated: {
        type: Date, default: Date.now()
    },
    status:{
        type: Boolean, default: true
    }
});

exports.UsersPaymentModel = mongoose.model("usersPayments", usersPaymentSchema);

exports.usersPaymentrValid = (_reqBody) => {
    let joiSchema = Joi.object({
        userId:Joi.string.required(),
        price: Joi.number().min(2).max(5000).required(),
        isPay: Joi.boolean().min(9).max(10).required(),
    });
    return joiSchema.validate(_reqBody);
}

