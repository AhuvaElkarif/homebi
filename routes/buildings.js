const express = require("express");
const { authAdmin, authToken } = require("../middlewares/auth");
const { BuildingModel, buildingValid } = require("../models/buildingModel")
const router = express.Router();

router.get("/", async (req, res) => {
    let perPage = Math.min(req.query.perPage, 20) || 4;
    let page = req.query.page || 1;
    let sort = req.query.sort || "_id";
    let reverse = req.query.reverse == "yes" ? -1 : 1;

    try {
        let data = await BuildingModel.find({})
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

router.get("/buildingByUserId", authToken, async (req, res) => {
    let perPage = Math.min(req.query.perPage, 20) || 4;
    let page = req.query.page || 1;
    let sort = req.query.sort || "_id";
    let reverse = req.query.reverse == "yes" ? -1 : 1;

    try {
        let data = await BuildingModel.find({ userId: req.tokenData._id })
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
        // path - מכוון אחרי המקודותיים לאיזה מאפיין אתה רצה לקחת מהמודל
        // model -  לפי הקולקשיין הזה תביא לי אובייקטים ממונגו
        let data = await BuildingModel.findOne({ _id: req.params.id })
        .populate({
            path: 'users',
            populate: {
              path: 'usersPayments',
               model: 'usersPayments'
            },
            model: 'users'
          })
            // .populate({ path: 'users', model: 'users' })
            .populate({ path: 'messages', model: 'messages' })
            .populate({ path: 'complaints', model: 'complaints' })
            // .populate({ path: 'usersPayments', model: 'usersPayments' });
        
            res.json(data);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ msg: "there error try again later", err })
    }
})

router.post("/", async (req, res) => {
    let validBody = buildingValid(req.body);
    if (validBody.error) {
        return res.status(400).json(validBody.error.details);
    }
    try {
        let building = new BuildingModel(req.body);
        // building.userId = req.tokenData._id;
        await building.save();
        res.status(201).json(building);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ msg: "there error try again later", err })
    }
})


router.put("/:editId", authToken, async (req, res) => {
    let validBody = buildingValid(req.body);
    if (validBody.error) {
        return res.status(400).json(validBody.error.details);
    }
    try {
        let editId = req.params.editId;
        let data;
        if (req.tokenData.role == "admin" || id == req.tokenData._id) {
            data = await BuildingModel.updateOne({ _id: editId, userId: req.tokenData._id }, req.body)
        }
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
        let data = await BuildingModel.updateOne({ _id: id }, req.body)
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
        let data = await BuildingModel.deleteOne({ _id: delId })
        res.json(data);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ msg: "there error try again later", err })
    }
})

module.exports = router;