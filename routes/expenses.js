const express = require("express");
const { authAdmin, authToken } = require("../middlewares/auth");
const { ExpenseModel, expenseValid } = require("../models/expenseModel");
const { BuildingModel } = require("../models/buildingModel");
const { UsersPaymentModel } = require("../models/usersPaymentModel");
const mongoose = require('mongoose');
const router = express.Router();


router.get("/:id", async (req, res) => {
    let perPage = Math.min(req.query.perPage, 20) || 4;
    let page = req.query.page || 1;
    let sort = req.query.sort || "_id";
    let reverse = req.query.reverse == "yes" ? -1 : 1;

    try {
        let data = await ExpenseModel.find({ buildId: req.params.id })
            .limit(perPage)
            .skip((page - 1) * perPage)
            .sort({ [sort]: reverse })
            console.log(req.params, data)
        res.json(data);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ msg: "there error try again later", err })
    }
})



router.get("/graph/:buildId", async (req, res) => {
    const currentYear = new Date().getFullYear();
    const buildId = new mongoose.Types.ObjectId(req.params.buildId); // Convert buildId to ObjectId
    // Generate an array of month numbers from 1 to 12
    const months = Array.from({ length: 12 }, (_, index) => index + 1);
    ExpenseModel.aggregate([
        {
            $match: {
                buildId: buildId,
                date_created: {
                    $gte: new Date(`${currentYear}-01-01`),
                    $lt: new Date(`${currentYear + 1}-01-01`),
                },

            },
        },
        {
            $group: {
                _id: { $month: "$date_created" },
                totalExpenses: { $sum: "$price" },
            },
        },
    ])
        .exec()
        .then((result) => {
            const monthlyExpenses = months.map((month) => {
                const matchedMonth = result.find((item) => item._id === month);
                return matchedMonth ? matchedMonth.totalExpenses : 0
            });
            console.log(monthlyExpenses);
            res.json(monthlyExpenses);
        })
        .catch((error) => {
            console.error(error);
            // Handle the error
        });





})
router.get("/payments/:buildId", async (req, res) => {
    // Create an array of all months in the year
    const currentYear = new Date().getFullYear();
    const buildId = new mongoose.Types.ObjectId(req.params.buildId); // Convert buildId to ObjectId
    const allMonths = Array.from({ length: 12 }, (_, index) => index + 1);
    UsersPaymentModel
        .aggregate([
            {
                $match: {
                    buildId: buildId,
                    dateCreated: {
                        $gte: new Date(`${currentYear}-01-01`),
                        $lt: new Date(`${currentYear + 1}-01-01`),
                    },
                },
            },
            {
                $group: {
                    _id: { $month: "$dateCreated" },
                    totalPayments: { $sum: "$price" },
                },
            },
            {
                $sort: {
                    _id: 1, // Sort by month in ascending order
                },
            },
        ])
        .exec()
        .then((result) => {
            // Create a map to store the monthly payments
            const monthlyPaymentsMap = new Map();

            // Initialize the map with all months and set their values to 0
            allMonths.forEach((month) => {
                monthlyPaymentsMap.set(month, 0);
            });

            // Update the map with the actual payments
            result.forEach((item) => {
                monthlyPaymentsMap.set(item._id, item.totalPayments);
            });

            // Convert the map to an array of objects
            const monthlyPayments = Array.from(monthlyPaymentsMap, ([month, totalPayments]) => (totalPayments));

            console.log(monthlyPayments);
            res.json(monthlyPayments);
            // Process the monthlyPayments array
        })
        .catch((error) => {
            console.error(error);
            // Handle the error
        });

})
router.get("/pie/:buildId", async (req, res) => {
    try {

        // Get the current year
        const currentYear = new Date().getFullYear();
        const buildId = new mongoose.Types.ObjectId(req.params.buildId); // Convert buildId to ObjectId
        // Query expenses for the current year
        const query = ExpenseModel.aggregate([
            {
                $match: {
                    buildId: buildId,
                    $expr: {
                        $and: [
                            { $eq: [{ $year: '$date_created' }, currentYear] },
                            { $eq: ['$isConst', true] },
                        ],
                    },
                },
            },
            {
                $group: {
                    _id: '$name',
                    totalCost: { $sum: '$price' },
                },
            },
        ]);

        // Execute the query as a promise
        query.exec()
            .then((expenses) => {
                // Calculate the total cost for all names
                const totalCostAllNames = expenses.reduce((total, expense) => total + expense.totalCost, 0);

                // Calculate the percentage for each name
                let remainingPercentage = 100;
                const expensesWithPercentage = expenses.map((expense, index) => {
                    let percentage;
                    if (index === expenses.length - 1) {
                        percentage = remainingPercentage;
                    } else {
                        percentage = Math.round((expense.totalCost / totalCostAllNames) * 100);
                        remainingPercentage -= percentage;
                    }
                    return {
                        label: expense._id,
                        totalCost: expense.totalCost,
                        y: percentage,
                    };
                });
                res.json(expensesWithPercentage);
                console.log('Expenses by Name:', expensesWithPercentage);
            })
            .catch((err) => {
                console.error('Error:', err);
            });

        // res.json(data);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ msg: "there error try again later", err })
    }
})


router.get("/single/:id", async (req, res) => {
    try {
        let data = await ExpenseModel.findOne({ _id: req.params.id });
        res.json(data);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ msg: "there error try again later", err })
    }
})

router.post("/:buildId", authAdmin, async (req, res) => {
    let validBody = expenseValid(req.body);
    if (validBody.error) {
        return res.status(400).json(validBody.error.details);
    }
    try {
        const { buildId } = req.params;
        console.log(req.body)
        console.log(buildId)
        let expense = new ExpenseModel(req.body);
        let rest = await BuildingModel.updateOne({ _id: buildId },
            { $pull: { 'expenses': { $in: [expense._id] } } })
        await expense.save();

        res.status(201).json(expense);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ msg: "there error try again later", err })
    }
})

router.patch("/changePay/:id", authAdmin, async (req, res) => {
    try {
        let id = req.params.id;
        let data = await ExpenseModel.updateOne({ _id: id }
            , [{ "$set": { "isPay": { "$eq": [false, "$isPay"] } } }]);
        res.json(data);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ msg: "there error try again later", err })
    }
})

router.put("/:editId", authAdmin, async (req, res) => {
    let validBody = expenseValid(req.body);
    if (validBody.error) {
        return res.status(400).json(validBody.error.details);
    }
    try {
        let editId = req.params.editId;
        let data = await ExpenseModel.updateOne({ _id: editId }, req.body)
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
        data = await ExpenseModel.updateOne({ _id: id }, req.body)
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
        data = await ExpenseModel.deleteOne({ _id: delId });
        res.json(data);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ msg: "there error try again later", err })
    }
})

router.get("/:month/:year/:buildId", authToken, async (req, res) => {
    let { month, year, buildId  } = req.params;

    try {

        let data = await ExpenseModel

            .find({
                $expr: {
                    $and: [
                        { $eq: [{ $month: '$date_created' }, month] },
                        { $eq: [{ $year: '$date_created' }, year] },
                        { $eq: ['$buildId', buildId] } // Add the filter for buildId
                    ]
                }
            })
        // .populate({ path: 'userId', model: 'users' });
        res.json(data);
    }
    catch (err) {
        console.log(err)
        res.status(500).json({ msg: "err", err })
    }

})


module.exports = router;