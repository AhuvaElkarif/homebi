const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const { authToken, authAdmin } = require("../middlewares/auth");
const { UserModel, loginValid, userValid, genToken, userEdit } = require("../models/userModel");
const { BuildingModel } = require("../models/buildingModel");

// ראוט שבודק שהטוקן תקין ומחזיר מידע עליו כגון איי די של המשתמש פלוס התפקיד שלו
router.get("/checkToken", authToken, async (req, res) => {
    res.json(req.tokenData);
})

router.get("/usersList", authAdmin, async (req, res) => {
    let perPage = Math.min(req.query.perPage, 20) || 10;
    let page = req.query.page || 1;
    let sort = req.query.sort || "_id";
    let reverse = req.query.reverse == "yes" ? -1 : 1;
    try {
        let data = await UserModel
            .find({})
            .limit(perPage)
            .sort({ [sort]: reverse })
            .skip((page - 1) * perPage);
        res.status(200).json(data);
    } catch (err) {
        console.log(err);
        res.status(500).send({ err: "error", err });
    }
})

router.get("/usersByBuilding", authAdmin, async (req, res) => {
    let perPage = Math.min(req.query.perPage, 20) || 10;
    let page = req.query.page || 1;
    let sort = req.query.sort || "_id";
    let reverse = req.query.reverse == "yes" ? -1 : 1;
    try {
        let data = await UserModel
            .find({ buildId: req.params.id })
            .limit(perPage)
            .sort({ [sort]: reverse })
            .skip((page - 1) * perPage);
        res.status(200).json(data);
    } catch (err) {
        console.log(err);
        res.status(500).send({ err: "error", err });
    }
})

router.get("/myInfo", authToken, async (req, res) => {
    try {
        let user = await UserModel.findOne({ _id: req.tokenData._id }, { password: 0 })
        .populate({
            path: 'buildId',
            populate: {
              path: 'users'
              , populate: {path:'usersPayments',model:'usersPayments'},
               model: 'users',
            },
            model: 'buildings'
          })    
        // .populate({ path: 'buildId', model: 'buildings' });
        res.json({ user });
    } catch (err) {
        console.log(err);
        res.status(500).send({ msg: "Error", err })
    }
})

router.post("/", async (req, res) => {
    const { buildId } = req.query;
    let validBody = userValid(req.body);
    if (validBody.error) {
        return res.status(400).json(validBody.error.details);
    }

    try {
        let user = new UserModel(req.body);
        user.password = await bcrypt.hash(user.password, 10);
        user.buildId = buildId;
        await user.save();
        let rest = await BuildingModel.updateOne({ _id: buildId }, { $push: { 'users': user._id } })
        console.log(rest);
        user.password = "******";
        res.status(201).json(user);
    } catch (err) {
        if (err.code == 11000) {
            return res.status(400).json({ msg: "Email already in system try again", code: 11000 });
        }
        console.log(err);
        res.status(500).send({ msg: "error", err });
    }
})

router.post("/login", async (req, res) => {
    let valdiateBody = loginValid(req.body);
    if (valdiateBody.error) {
        return res.status(400).json(valdiateBody.error.details)
    }
    try {
        let user = await UserModel.findOne({ email: req.body.email })
        if (!user) {
            return res.status(401).json({ msg: "User and password not match 1" })
        }

        let validPassword = await bcrypt.compare(req.body.password, user.password);
        if (!validPassword) {
            return res.status(401).json({ msg: "User and password not match 2" })
        }

        let newToken = genToken(user._id, user.role);
        res.json({ token: newToken });
    }
    catch (err) {

        console.log(err)
        res.status(500).json({ msg: "err", err })
    }
})

router.put("/:idEdit", authToken, async (req, res) => {

    let validBody = userEdit(req.body);
    if (validBody.error) {
        res.status(400).json(validBody.error.details);
    }

    try {
        let id = req.params.idEdit;
        let data;
        if (req.tokenData.role == "admin" || id == req.tokenData._id) {
            data = await UserModel.updateOne({ _id: id }, req.body);
        }

        if (!data) {
            return res.status(400).json({ err: "This operation is not enabled !" })
        }

        res.status(201).json(data);
    } catch (err) {
        console.log(err);
        res.status(500).send({ msg: "error", err });
    }
})

router.delete("/:idDel/:buildId", authAdmin, async (req, res) => {
    try {
        let id = req.params.idDel;
        let buildId = req.params.buildId;
        let data;
        let rest = await BuildingModel.updateOne({ _id: buildId },
            { $pull: { 'users': { $in: [id] } } })
        if (req.tokenData.role === "admin") {
            data = await UserModel.deleteOne({ _id: id });
        }
        else if (id === req.tokenData._id) {
            data = await UserModel.deleteOne({ _id: id });
        }
        res.status(201).json(data);
    } catch (err) {
        console.log(err);
        res.status(500).send({ msg: "error", err });
    }
})

module.exports = router;