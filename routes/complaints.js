const express = require("express");
const { authAdmin, authToken } = require("../middlewares/auth");
const { ComplaintModel, complaintValid } = require("../models/complaintModel");
const { ExpenseModel } = require("../models/expenseModel");
const router = express.Router();

router.get("/", async (req, res) => {
    let perPage = Math.min(req.query.perPage, 20) || 4;
    let page = req.query.page || 1;
    let sort = req.query.sort || "_id";
    let reverse = req.query.reverse == "yes" ? -1 : 1;

    try {
        let data = await ComplaintModel.find({})
            .populate({ path: 'userId', model: 'users' })
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


router.get("/:id", authToken, async (req, res) => {
    let perPage = Math.min(req.query.perPage, 20) || 4;
    let page = req.query.page || 1;
    let sort = req.query.sort || "_id";
    let reverse = req.query.reverse == "yes" ? -1 : 1;

    try {
        let data = await ComplaintModel.find({ userId: req.params.id })
            .populate({ model: "users", path: "userId" })
            .limit(perPage)
            .skip((page - 1) * perPage)
            .sort({ [sort]: reverse });
        res.json(data);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ msg: "there error try again later", err })
    }
})

router.get("/byBuild/:id", authToken, async (req, res) => {
    let perPage = Math.min(req.query.perPage, 20) || 4;
    let page = req.query.page || 1;
    let sort = req.query.sort || "_id";
    let reverse = req.query.reverse == "yes" ? -1 : 1;

    try {
        let data = await ComplaintModel.find({ buildId: req.params.id })
            .populate({ model: "users", path: "userId" })
            .limit(perPage)
            .skip((page - 1) * perPage)
            .sort({ [sort]: reverse });
        res.json(data);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ msg: "there error try again later", err })
    }
})

router.get("/single/:id", async (req, res) => {
    try {
        let data = await ComplaintModel.findOne({ _id: req.params.id });
        res.json(data);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ msg: "there error try again later", err })
    }
})

router.post("/", authToken, async (req, res) => {
    let validBody = complaintValid(req.body);
    if (validBody.error) {
        return res.status(400).json(validBody.error.details);
    }
    try {
        let complaint = new ComplaintModel(req.body);
        complaint.userId = req.tokenData._id;
        await complaint.save();
        res.status(201).json(complaint);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ msg: "there error try again later", err })
    }
})


router.put("/:editId", authToken, async (req, res) => {
    let validBody = complaintValid(req.body);
    if (validBody.error) {
        return res.status(400).json(validBody.error.details);
    }
    try {
        let editId = req.params.editId;
        let data = await ComplaintModel.updateOne({ _id: editId }, req.body)
        res.json(data);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ msg: "there error try again later", err })
    }
})

router.put("/changeHandled/:editId", authToken, async (req, res) => {
    try {
        let editId = req.params.editId;
        let data = await ComplaintModel.updateOne({ _id: editId }
            , [{ "$set": { "isHandled": { "$eq": [false, "$isHandled"] } } }]);
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
        if (req.tokenData.role == "admin") {
            data = await ComplaintModel.updateOne({ _id: id }, req.body)
        } else {
            data = await ComplaintModel.updateOne({ _id: id, userId: req.tokenData._id }, req.body)
        }
        res.json(data);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ msg: "there error try again later", err })
    }
})

router.delete("/:id", authToken, async (req, res) => {
    try {
        let id = req.params.id;
        let data;
        if (req.tokenData.role == "admin") {
            data = await ComplaintModel.deleteOne({ _id: id });
        } else {
            data = await ComplaintModel.deleteOne({ _id: id, userId: req.tokenData._id });
        }
        res.json(data);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ msg: "there error try again later", err })
    }
})

module.exports = router;