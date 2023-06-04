const express = require("express");
const { authAdmin } = require("../middlewares/auth");
const { ProperyModel, propertyValid } = require("../models/propertyModel");
const router = express.Router();

router.get("/", async (req, res) => {
    let perPage = Math.min(req.query.perPage, 20) || 4;
    let page = req.query.page || 1;
    let sort = req.query.sort || "_id";
    let reverse = req.query.reverse == "yes" ? -1 : 1;

    try {
        let data = await ProperyModel.find({})
            .limit(perPage)
            .skip((page - 1) * perPage)
            .sort({ [sort]: reverse })
        res.json(data);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ msg: "there error try again later", err })
    }
})

router.get("/:id", async (req, res) => {
    let perPage = Math.min(req.query.perPage, 20) || 4;
    let page = req.query.page || 1;
    let sort = req.query.sort || "_id";
    let reverse = req.query.reverse == "yes" ? -1 : 1;

    try {
        let data = await ProperyModel.find({ buildId: req.params.id })
            .limit(perPage)
            .skip((page - 1) * perPage)
            .sort({ [sort]: reverse })
        res.json(data);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ msg: "there error try again later", err })
    }
})

router.get("/single/:id", async (req, res) => {
    try {
        let data = await ProperyModel.findOne({ _id: req.params.id });
        res.json(data);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ msg: "there error try again later", err })
    }
})

router.post("/", async (req, res) => {
    let validBody = propertyValid(req.body);
    if (validBody.error) {
        return res.status(400).json(validBody.error.details);
    }
    try {
        let properties = new ProperyModel(req.body);
        await properties.save();
        res.status(201).json(properties);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ msg: "there error try again later", err })
    }
})


router.put("/:editId", authAdmin, async (req, res) => {
    let validBody = propertyValid(req.body);
    if (validBody.error) {
        return res.status(400).json(validBody.error.details);
    }
    try {
        let editId = req.params.editId;
        let data = await ProperyModel.updateOne({ _id: editId }, req.body)
        res.json(data);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ msg: "there error try again later", err })
    }
})

router.put("/:changeStatus", authAdmin, async (req, res) => {
    try {
        let id = req.params.id;
        let data;
        data = await ProperyModel.updateOne({ _id: id }, req.body)
        res.json(data);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ msg: "there error try again later", err })
    }
})

router.delete("/:delId", authAdmin, async (req, res) => {
    try {
        let delId = req.params.delId;
        let data;
        data = await CakeModel.deleteOne({ _id: delId });
        res.json(data);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ msg: "there error try again later", err })
    }
})

module.exports = router;