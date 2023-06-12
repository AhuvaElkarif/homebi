const express = require("express");
const { authToken, authAdmin } = require("../auth/authToken");
const { UsersPaymentModel, usersPaymentrValid } = require("../models/usersPaymentModel")
const router = express.Router();


router.get("/", async (req, res) => {
  // Math.min -> המספר המקסימלי יהיה 20 כדי שהאקר לא ינסה
  // להוציא יותר אם אין צורך בזה מבחינת הלקוח
  let perPage = Math.min(req.query.perPage, 20) || 4;
  let page = req.query.page || 1;
  let sort = req.query.sort || "_id";
  // מחליט אם הסורט מהקטן לגדול 1 או גדול לקטן 1- מינוס 
  let reverse = req.query.reverse == "yes" ? -1 : 1;

  try {
    let data = await UsersPaymentModel
      .find({})
      .limit(perPage)
      .skip((page - 1) * perPage)
      .sort({ [sort]: reverse })
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
  // Math.min -> המספר המקסימלי יהיה 20 כדי שהאקר לא ינסה
  // להוציא יותר אם אין צורך בזה מבחינת הלקוח
  let perPage = Math.min(req.query.perPage, 20) || 4;
  let page = req.query.page || 1;
  let sort = req.query.sort || "_id";
  // מחליט אם הסורט מהקטן לגדול 1 או גדול לקטן 1- מינוס 
  let reverse = req.query.reverse == "yes" ? -1 : 1;
  try {
    let data;
    if (req.tokenData.role == "admin") {
      data = await UsersPaymentModel
        .find({ buildId: req.params.id })
        .limit(perPage)
        .skip((page - 1) * perPage)
        .sort({ [sort]: reverse })
    } else {
      data = await UsersPaymentModel
        .find({ buildId: req.tokenData._id })
        .limit(perPage)
        .skip((page - 1) * perPage)
        .sort({ [sort]: reverse })
    }
    res.json(data);

  }
  catch (err) {
    console.log(err)
    res.status(500).json({ msg: "err", err })

  }
})

//הוספת תשלום לדייר ספציפי
router.post("/", authAdmin, async (req, res) => {
  let valdiateBody = usersPaymentrValid(req.body);
  if (valdiateBody.error) {
    return res.status(400).json(valdiateBody.error.details)
  }
  try {
    let user = new UsersPaymentModel(req.body);
    // הוספת מאפיין האיי די של המשתמש
    // בהמשך יעזור לנו לזהות שירצה למחוק או לערוך רשומה
    //  tokenData._id; -> מגיע מפונקציית האוט מהטוקן ומכיל את 
    // האיי די של המשתמש
    await user.save();
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