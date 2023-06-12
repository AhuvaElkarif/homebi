const express = require("express");
const { authToken, authAdmin } = require("../auth/authToken");
const { WorkerModel, workerValid } = require("../models/workerModel")
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
    let data = await WorkerModel
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

//תצוגה לפי ID בניין 
router.get("/:id", async (req, res) => {
  // Math.min -> המספר המקסימלי יהיה 20 כדי שהאקר לא ינסה
  // להוציא יותר אם אין צורך בזה מבחינת הלקוח
  let perPage = Math.min(req.query.perPage, 20) || 4;
  let page = req.query.page || 1;
  let sort = req.query.sort || "_id";
  // מחליט אם הסורט מהקטן לגדול 1 או גדול לקטן 1- מינוס 
  let reverse = req.query.reverse == "yes" ? -1 : 1;

  try {
    let data = await WorkerModel
      .find({ buildId: req.params.id })
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



// הוספת עובד עי הועד 
router.post("/", authAdmin, async (req, res) => {
  let valdiateBody = workerValid(req.body);
  if (valdiateBody.error) {
    return res.status(400).json(valdiateBody.error.details)
  }
  try {
    let work = new WorkerModel(req.body);
    // הוספת מאפיין האיי די של המשתמש
    // בהמשך יעזור לנו לזהות שירצה למחוק או לערוך רשומה
    //  tokenData._id; -> מגיע מפונקציית האוט מהטוקן ומכיל את 
    // האיי די של המשתמש
    await work.save();
    res.status(201).json(work)
  }
  catch (err) {
    console.log(err)
    res.status(500).json({ msg: "err", err })
  }
})

// עדכון פרטי העובד לפי ID
router.put("/:editId", authAdmin, async (req, res) => {
  let validBody = workerValid(req.body);
  if (validBody.error) {
    return res.status(400).json(validBody.error.details);
  }
  try {
    let editId = req.params.editId;
    let data;
    data = await WorkerModel.updateOne({ _id: editId }, req.body)
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
    data = await WorkerModel.deleteOne({ _id: delId });
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