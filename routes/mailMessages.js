const nodemailer = require('nodemailer');
const express = require("express");
const router = express.Router();

router.post("/", (req, res) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'housement9@gmail.com',
      pass: 'gptpcfsnikgbjpfk',
    },
  });

  const { to, subject, text } = req.body;
console.log(req.body)
  const mailOptions = {
    from: 'housement9@gmail.com',
    to,
    subject,
    text,
    html:text
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
    } else {
      console.log('Email sent:', info.response);
    }
  });

});

module.exports = router;