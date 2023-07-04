const express = require("express");
const { authToken, authAdmin } = require("../auth/authToken");
const { UsersPaymentModel, usersPaymentrValid } = require("../models/usersPaymentModel");
const { UserModel } = require("../models/userModel");
const { BuildingModel } = require("../models/buildingModel");
const router = express.Router();
const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;


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
const getPaymentsForYearInBuilding = async (buildingId, year) => {
  try {
    const building = await BuildingModel.findById(buildingId);

    const filteredUserPayments = building.users.reduce((acc, user) => {
      const userPaymentsForYear = user.usersPayments ?? [] // Nullish coalescing operator

      const filteredPayments = userPaymentsForYear.filter(payment => {
        const paymentYear = payment.dateCreated.getFullYear();
        return paymentYear === year;
      });

      return [...acc, ...filteredPayments];
    }, []);

    console.log(filteredUserPayments);
    // Do something with the filteredUserPayments
  } catch (error) {
    console.error(error);
  }
};


// const getPaymentsForYearInBuilding = async (buildingId, year) => {
//   try {
//     console.log
//     const pipeline = [
//       {
//         $match: {
//           _id: new ObjectId(buildingId),
//           'usersPayments.dateCreated': {
//             $gte: new Date(`${year}-01-01`),
//             $lt: new Date(`${Number(year) + 1}-01-01`),
//           },
//         },
//       },
//       {
//         $project: {
//           usersPayments: {
//             $filter: {
//               input: '$usersPayments',
//               as: 'payment',
//               cond: {
//                 $and: [
//                   { $gte: ['$$payment.dateCreated', new Date(`${year}-01-01`)] },
//                   { $lt: ['$$payment.dateCreated', new Date(`${Number(year) + 1}-01-01`)] },
//                 ],
//               },
//             },
//           },
//         },
//       },
//     ];

//     const building = await BuildingModel.aggregate(pipeline);

//     console.log(building);
//     // Do something with the building and its filtered userPayments
//   } catch (error) {
//     console.error(error);
//   }
// };



// Usage

router.get("/byYear/:year/:buildId", authAdmin, async (req, res) => {
  const { buildId, year } = req.params;

  try {
    getPaymentsForYearInBuilding(buildId, year);

  }
  catch (err) {
    console.log(err);
    res.status(500).json({ msg: "there error try again later", err })
  }
})

router.get("/:month/:year/:buildId", authToken, async (req, res) => {
  let { month, year, buildId } = req.params;

  try {
    let data = await UsersPaymentModel
      .find({
        $expr: {
          $and: [
            { $eq: [{ $month: '$dateCreated' }, month] },
            { $eq: [{ $year: '$dateCreated' }, year] },
            { $eq: ['$buildId', buildId] } // Add the filter for buildId
          ]
        }
      })
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
    // const objectId = new mongoose.Types.ObjectId(req.body.buildId);
    // req.body.buildId = objectId; 
    console.log(req.body)
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
    let data = await UsersPaymentModel.updateOne({ _id: id }, req.body)
    res.json(data);
  }
  catch (err) {
    console.log(err);
    res.status(500).json({ msg: "there error try again later", err })
  }
})

router.patch("/changePay/:id", authAdmin, async (req, res) => {
  try {
    let id = req.params.id;
    let data = await UsersPaymentModel.updateOne({ _id: id }
      , [{ "$set": { "isPay": { "$eq": [false, "$isPay"] } } }]);
    res.json(data);
  }
  catch (err) {
    console.log(err);
    res.status(500).json({ msg: "there error try again later", err })
  }
})


module.exports = router;