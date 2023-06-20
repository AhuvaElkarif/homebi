// const express = require("express");
// const { authAdmin } = require("../middlewares/auth");
// const { imageValid, ImageModel } = require("../models/imageModel")
// const router = express.Router();

// router.get("/", async (req, res) => {
//     let perPage = Math.min(req.query.perPage, 20) || 4;
//     let page = req.query.page || 1;
//     let sort = req.query.sort || "_id";
//     let reverse = req.query.reverse == "yes" ? -1 : 1;

//     try {
//         let data = await ImageModel.find({})
//             .limit(perPage)
//             .skip((page - 1) * perPage)
//             .sort({ [sort]: reverse })
//         res.json(data);
//     }
//     catch (err) {
//         console.log(err);
//         res.status(500).json({ msg: "there error try again later", err })
//     }
// })

// router.get("/:id", async (req, res) => {
//     let perPage = Math.min(req.query.perPage, 20) || 4;
//     let page = req.query.page || 1;
//     let sort = req.query.sort || "_id";
//     let reverse = req.query.reverse == "yes" ? -1 : 1;

//     try {
//         let data = await ImageModel.find({ buildId: req.params.id })
//             .limit(perPage)
//             .skip((page - 1) * perPage)
//             .sort({ [sort]: reverse })
//         res.json(data);
//     }
//     catch (err) {
//         console.log(err);
//         res.status(500).json({ msg: "there error try again later", err })
//     }
// })

// router.get("/single/:id", async (req, res) => {
//     try {
//         let data = await ImageModel.findOne({ _id: req.params.id });
//         res.json(data);
//     }
//     catch (err) {
//         console.log(err);
//         res.status(500).json({ msg: "there error try again later", err })
//     }
// })

// router.post("/", authAdmin, async (req, res) => {
//     let validBody = imageValid(req.body);
//     if (validBody.error) {
//         return res.status(400).json(validBody.error.details);
//     }
//     try {
//         let image = new ImageModel(req.body);
//         await image.save();
//         res.status(201).json(image);
//     }
//     catch (err) {
//         console.log(err);
//         res.status(500).json({ msg: "there error try again later", err })
//     }
// })


// router.put("/:editId", authAdmin, async (req, res) => {
//     let validBody = imageValid(req.body);
//     if (validBody.error) {
//         return res.status(400).json(validBody.error.details);
//     }
//     try {
//         let editId = req.params.editId;
//         let data = await ImageModel.updateOne({ _id: editId }, req.body)
//         res.json(data);
//     }
//     catch (err) {
//         console.log(err);
//         res.status(500).json({ msg: "there error try again later", err })
//     }
// })

// router.put("/:changeStatus", authAdmin, async (req, res) => {
//     try {
//         let id = req.params.id;
//         let data;
//         data = await ImageModel.updateOne({ _id: id }, req.body)
//         res.json(data);
//     }
//     catch (err) {
//         console.log(err);
//         res.status(500).json({ msg: "there error try again later", err })
//     }
// })

// router.delete("/:delId", authAdmin, async (req, res) => {
//     try {
//         let delId = req.params.delId;
//         let data;
//         data = await CakeModel.deleteOne({ _id: delId });
//         res.json(data);
//     }
//     catch (err) {
//         console.log(err);
//         res.status(500).json({ msg: "there error try again later", err })
//     }
// })

// module.exports = router;