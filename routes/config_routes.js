const indexR = require("./index");
const usersR = require("./users");
const aboutsR = require("./abouts");
const buildingsR = require("./buildings");
const complaintsR = require("./complaints");
const expensesR  = require("./expenses");
const messagesR = require("./messages");
const propertiesR = require("./properties");
const typeExpensesR = require("./typeExpenses");
const typeProffesionR = require("./typeProffesions");
const usersPaymentsR = require("./usersPayments");
const workersR = require("./workers");
const workersPaymentsR = require("./workersPayments");
const whatsAppMessageR = require("./whatsAppMessages");
const mailMessagesR = require("./mailMessages");

exports.routesInit = (app) => {
   app.use("/", indexR);
   app.use("/users", usersR);
   app.use("/abouts", aboutsR);
   app.use("/buildings", buildingsR);
   app.use("/complaints", complaintsR);
   app.use("/expenses", expensesR);
   app.use("/properties", propertiesR);
   app.use("/typeExpenses", typeExpensesR);
   app.use("/typeProffesions", typeProffesionR);
   app.use("/usersPayments", usersPaymentsR);
   app.use("/workers", workersR);
   app.use("/messages", messagesR);
   app.use("/workerPayments", workersPaymentsR);
   app.use("/whatsAppMessages", whatsAppMessageR);
   app.use("/mailMessages", mailMessagesR);
}