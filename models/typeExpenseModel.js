const mongoose = require("mongoose");
const Joi = require("joi");

const typeExpenseSchema = new mongoose.Schema({
    type: String,//חשמל
    propertiesList:Array,
    
    status:{
        type: Boolean, default: true
    }
});

exports.TypeExpenseModel = mongoose.model("typeExpenses", typeExpenseSchema);

exports.typeExpenseValid = (_reqBody) => {
    let joiSchema = Joi.object({
        type: Joi.string().min(2).max(50).required(),
       
        propertiesList: Joi.array().required(),
    });
    return joiSchema.validate(_reqBody);
}

