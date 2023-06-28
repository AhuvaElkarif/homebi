const nodemailer = require('nodemailer');
const express = require("express");
const router = express.Router();

router.post("/", (req, res) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'homebi1212@gmail.com',
      pass: 'xqtyjrwbnjnyylog',
    },
  });

  const { to, subject, text } = req.body;

  const mailOptions = {
    from: 'hombei1212@gmail.com',
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