const mongoose = require("mongoose");
const Joi = require("joi");

const workersPaymentSchema = new mongoose.Schema({
    typeExpenseId:String,
    description:String,
    isPay:Boolean,
    dateCreated: {
        type: Date, default: Date.now()
    },
    status:{
        type: Boolean, default: true
    }

});

exports.WorkersPaymentModel = mongoose.model("workersPayments", workersPaymentSchema);

exports.workersPaymentValid = (_reqBody) => {
    let joiSchema = Joi.object({
        description: Joi.string().min(2).max(50).required(),
        isPay: Joi.boolean().required(),
        typeExpenseId:Joi.string().required()
    });
    return joiSchema.validate(_reqBody);
}

