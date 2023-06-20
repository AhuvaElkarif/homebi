const mongoose = require("mongoose");
const Joi = require("joi");

const typeProfessionSchema = new mongoose.Schema({
    typeProfession: { type: String, default: "" },
    dateCreated: { type: Date, default: Date.now() },
    status: { type: Boolean, default: true }
});

exports.TypeProfessionModel = mongoose.model("typeProfessions", typeProfessionSchema);

exports.typeProffesionValid = (_reqBody) => {
    let joiSchema = Joi.object({
        typeProfession: Joi.string().required(),
    });
    return joiSchema.validate(_reqBody);
}


