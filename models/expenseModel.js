const mongoose = require("mongoose");
const Joi = require("joi");

const expenseSchema = new mongoose.Schema({
    buildId: String,
    isConst: Boolean,
    price:Number,
    isPay:Boolean,
    typeProffesionId:String,
    status: {
        type: Boolean, default: true
    },
    date_created: {
        type: Date, default: Date.now()
    }
});

exports.ExpenseModel = mongoose.model("expenes", expenseSchema);

exports.expenseValid = (_reqBody) => {
    let joiSchema = Joi.object({
        buildId: Joi.string().required(),
        isConst: Joi.boolean().required(),
        price: Joi.number().min(2).max(10000000).required(),
        isPay: Joi.boolean().required(),
        typeProffesionId: Joi.string().required(),
    });
    return joiSchema.validate(_reqBody);
}

