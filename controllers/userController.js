const { RestaurantModel } = require("../models/restaurantModel");
const { UserModel } = require("../models/userModel");
const { itemMenuModel } = require("../models/itemMenuModel");
const { validateItemMenu, validateEditItemMenu } = require("../validation/itemMenuValidation");

// צריך לעדכן את הבקשות מאחר והמודל השתנה
exports.MenuCtrl = {
    getMenu: async (req, res) => {
        let { restId } = req.params
        try {
            // path - מכוון אחרי המקודותיים לאיזה מאפיין אתה רצה לקחת מהמודל
            // model -  לפי הקולקשיין הזה תביא לי אובייקטים ממונגו
            let restaurant = await RestaurantModel.findOne({ _id: restId }).populate({ path: 'menu', model: 'itemmenus' });
            res.json(restaurant.menu)
        } catch (err) {
            console.log(err);
            res.status(500).json({ msg: "there error try again later", err })
        }
    },
    createItemMenu: async (req, res) => {
        let validBody = validateItemMenu(req.body);
        let { restId } = req.params

        if (validBody.error) return res.status(401).json(validBody.error.details);
        // let {workId}= req.params
        try {
            let itemMenu = new itemMenuModel(req.body);
            itemMenu.workerID = req.tokenData._id
            await itemMenu.save();
            // לאחר יצירת מנה הוספנו את האיי די לוורקר איי די 
            // לאחר מכן הוספנו את האיי די של המנה לרשימת האובייקטים שנמצאים במניו של אותה מסעדה
            let rest = await RestaurantModel.updateOne({ _id: restId }, { $push: { 'menu': itemMenu._id } })

            res.json(itemMenu)
        } catch (err) {
            console.log(err);
            res.status(500).json({ msg: "there error try again later", err })
        }
    },

    removeItemMenu: async (req, res) => {

        let { itemId, restId } = req.params
        try {
            // console.log(restId)

            let rest = await RestaurantModel.updateOne({ _id: restId }, { $pull: { 'menu': { $in: [itemId] } } })
            let itemDel = await itemMenuModel.deleteOne({ _id: itemId })

            // console.log(rest)

            res.json({ itemDel, rest })
        } catch (err) {
            console.log(err);
            res.status(500).json({ msg: "there error try again later", err })
        }
    }

    ,
    editItemMenu: async (req, res) => {
        let validBody = validateEditItemMenu(req.body);
        if (validBody.error) {
            return res.status(400).json({ msg: "Need to send body" });
        }
        let { editItemId } = req.params
        try {
            console.log(req.body)
            let itemEdit = await itemMenuModel.updateOne({ _id: editItemId }, req.body)
            res.json(itemEdit)
        } catch (err) {
            console.log(err);
            res.status(500).json({ msg: "there error try again later", err })
        }
    },
    // editCategoryItemMenu: async (req, res) => {

    //     if (!req.body.category.name) {
    //       return res.status(400).json({ msg: "Need to send category" });
    //     }
    //     let { editItemId } = req.params
    //     try {
    //         console.log(req.body)
    //         let itemEdit = await itemMenuModel.updateOne({ _id: editItemId },{$set:{'category.name':req.body.category.name}})
    //         res.json(itemEdit)
    //     } catch (err) {
    //         console.log(err);
    //         res.status(500).json({ msg: "there error try again later", err })
    //     }
    // },
    // editSubcategoryItemMenu: async (req, res) => {

    //     if (!req.body.category.subcategory) {
    //       return res.status(400).json({ msg: "Need to send subcategory" });
    //     }
    //     let { editItemId } = req.params
    //     try {
    //         console.log(req.body)
    //         let itemEdit = await itemMenuModel.updateOne({ _id: editItemId },{$set:{'category.subcategory':req.body.category.subcategory}})
    //         res.json(itemEdit)
    //     } catch (err) {
    //         console.log(err);
    //         res.status(500).json({ msg: "there error try again later", err })
    //     }
    // }

}

