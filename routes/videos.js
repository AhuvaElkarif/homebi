const express = require("express");
const { authToken, authAdmin } = require("../auth/authToken");
const { VideoModel, videoValid } = require("../models/videoModel")
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
    let data = await VideoModel
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

//הוספת וידאו 
router.post("/", authAdmin, async (req, res) => {
  let valdiateBody = videoValid(req.body);
  if (valdiateBody.error) {
    return res.status(400).json(valdiateBody.error.details)
  }

  try {
    let video = new VideoModel(req.body);
    await video.save();
    res.status(201).json(video)
  }
  catch (err) {
    console.log(err)
    res.status(500).json({ msg: "err", err })
  }
})


//מחיקת וידאו
router.delete("/:delId", authAdmin, async (req, res) => {
  try {
    let delId = req.params.delId;
    let data;
    data = await VideoModel.deleteOne({ _id: delId });
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