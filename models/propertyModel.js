const mongoose = require("mongoose");
const Joi = require("joi");

const propertySchema = new mongoose.Schema({
    isConditioner: Boolean,
    isElectrical : Boolean,
    isStairs: Boolean,
    isWater: Boolean,
    isGardening: Boolean,
    isBanquetRoom:Boolean,
    isPool:Boolean,
    isSecuring:Boolean,
    isGym:Boolean,
    isElevators:Boolean,
    isParking:Boolean,
    build_id:String,
    date_created: {
        type: Date, default: Date.now()
    }
});

exports.ProperyModel = mongoose.model("properties", propertySchema);

exports.propertyValid = (_reqBody) => {
    let joiSchema = Joi.object({
        isConditioner: Joi.boolean().required(),
        isElectrical: Joi.boolean.required(),
        isStairs: Joi.boolean().required(),
        isWater: Joi.boolean().required(),
        isGardening: Joi.boolean().required(),
        isBanquetRoom: Joi.boolean().required(),
        isPool: Joi.boolean().required(),
        isSecuring: Joi.boolean().required(),
        isGym: Joi.boolean().required(),
        isElevators: Joi.boolean().required(),
        isParking: Joi.boolean().required(),
        build_id: Joi.string().required(),
    });
    return joiSchema.validate(_reqBody);
}
