const mongoose = require("mongoose");
const Joi = require("joi");

const expenseSchema = new mongoose.Schema({
    isConst: { type: Boolean, default: false },
    price: { type: Number, default: 0 },
    isPay: { type: Boolean, default: false },
    name: { type: String, default: "" },
    // typeProffesionId: { type: mongoose.ObjectId, default: null },
    // typeExpenseId: { type: mongoose.ObjectId, default: null },
    status: { type: Boolean, default: true },
    buildId: { type: mongoose.ObjectId, default: "" },
    date_created: { type: Date, default: Date.now() }
});

exports.ExpenseModel = mongoose.model("expenses", expenseSchema);

exports.expenseValid = (_reqBody) => {
    let joiSchema = Joi.object({
        // isConst: Joi.boolean().required(),
        price: Joi.number().min(2).max(10000000).required(),
        isPay: Joi.boolean().required(),
        buildId: Joi.string().required(),
        // typeProffesionId: Joi.string().allow(null, ''),
        // typeProffesionId: Joi.string().allow(null, ''),
        name: Joi.string().required(),
    });
    return joiSchema.validate(_reqBody);
}

