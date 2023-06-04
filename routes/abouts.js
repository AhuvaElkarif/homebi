const express = require("express");
const { authAdmin } = require("../middlewares/auth");
const { AboutModel, aboutValid } = require("../models/aboutModel")
const router = express.Router();

router.get("/", async (req, res) => {
    let perPage = Math.min(req.query.perPage,20) || 4;
    let page = req.query.page || 1;
    let sort = req.query.sort || "_id";
    let reverse = req.query.reverse == "yes" ? -1 : 1;

    try {
        let data = await AboutModel.find({})
            .limit(perPage)
            .skip((page - 1) * perPage)
            .sort({[sort]:reverse})
        res.json(data);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ msg: "there error try again later", err })
    }
})

router.get("/single/:id", async (req, res) => {
    try {
        let data = await AboutModel.findOne({ _id: req.params.id });
        res.json(data);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ msg: "there error try again later", err })
    }
})

router.post("/", authAdmin, async (req, res) => {
    let validBody = aboutValid(req.body);
    if (validBody.error) {
        return res.status(400).json(validBody.error.details);
    }
    try {
        let about = new AboutModel(req.body);
        await about.save();
        res.status(201).json(about);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ msg: "there error try again later", err })
    }
})


router.put("/:editId", authAdmin, async (req, res) => {
    let validBody = aboutValid(req.body);
    if (validBody.error) {
        return res.status(400).json(validBody.error.details);
    }
    try {
        let editId = req.params.editId;
        let data = await AboutModel.updateOne({ _id: editId }, req.body)
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
        let data = await AboutModel.deleteOne({ _id: delId })
        res.json(data);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ msg: "there error try again later", err })
    }
})

module.exports = router;