const express = require("express");
const { authToken, authAdmin } = require("../auth/authToken");
const { UsersPaymentModel, usersPaymentrValid } = require("../models/usersPaymentModel");
const { UserModel } = require("../models/userModel");
const router = express.Router();


router.get("/", async (req, res) => {
  let perPage = Math.min(req.query.perPage, 20) || 4;
  let page = req.query.page || 1;
  let sort = req.query.sort || "_id";
  let reverse = req.query.reverse == "yes" ? -1 : 1;

  try {
    let data = await UsersPaymentModel
      .find({})
      .limit(perPage)
      .skip((page - 1) * perPage)
      .sort({ [sort]: reverse })
      .populate({ path: 'userId', model: 'users' });
    res.json(data);
  }
  catch (err) {
    console.log(err)
    res.status(500).json({ msg: "err", err })
  }

})

router.get("/:min/:max", authToken, async (req, res) => {
  const {min, max} = req.params;
  try {
    let data = await UsersPaymentModel
      .find({ $and: [{ dateCreated: { $gte: min } }, { dateCreated: { $lte: max } }] })
      .populate({ path: 'userId', model: 'users' });
    res.json(data);
  }
  catch (err) {
    console.log(err)
    res.status(500).json({ msg: "err", err })
  }

})


// הצגה לועד תשלומים של בניין 
// הצגה לדייר תשלומים אישיים שלו
router.get("/:id", async (req, res) => {
  let perPage = Math.min(req.query.perPage, 20) || 4;
  let page = req.query.page || 1;
  let sort = req.query.sort || "_id";
  let reverse = req.query.reverse == "yes" ? -1 : 1;
  try {
    let data;
    if (req.tokenData.role == "admin") {
      data = await UsersPaymentModel
        .find({ buildId: req.params.id })
        .limit(perPage)
        .skip((page - 1) * perPage)
        .sort({ [sort]: reverse })
        .populate({ path: 'userId', model: 'users' });
    } else {
      data = await UsersPaymentModel
        .find({ buildId: req.tokenData._id })
        .limit(perPage)
        .skip((page - 1) * perPage)
        .sort({ [sort]: reverse })
        .populate({ path: 'userId', model: 'users' });

    }
    res.json(data);

  }
  catch (err) {
    console.log(err)
    res.status(500).json({ msg: "err", err })

  }
})

//הוספת תשלום לדייר ספציפי
router.post("/:userId", authAdmin, async (req, res) => {
  let valdiateBody = usersPaymentrValid(req.body);
  if (valdiateBody.error) {
    return res.status(400).json(valdiateBody.error.details)
  }
  try {
    let { userId } = req.params;
    let user = new UsersPaymentModel(req.body);
    user.userId = userId;
    await user.save();
    let rest = await UserModel.updateOne({ _id: userId }, { $push: { 'usersPayments': user._id } })

    res.status(201).json(user)
  }
  catch (err) {
    console.log(err)
    res.status(500).json({ msg: "err", err })
  }
})


// עדכון תשלום לדייר ספסיפי
router.put("/:editId", authAdmin, async (req, res) => {
  let validBody = usersPaymentrValid(req.body);
  if (validBody.error) {
    return res.status(400).json(validBody.error.details);
  }
  try {
    let editId = req.params.editId;
    let data;
    data = await UsersPaymentModel.updateOne({ _id: editId }, req.body)
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


module.exports = router;