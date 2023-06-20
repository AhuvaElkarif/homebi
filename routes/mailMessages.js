const nodemailer = require('nodemailer');
const express = require("express");
const router = express.Router();

router.post("/", (req, res) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'homebi1212@gmail.com',
          pass: 'homebi1234!',
        },
      });

      const mailOptions = {
        from: 'hombei1212@gmail.com',
        to: 'ahuvael02@gmail.com',
        subject: 'Hello from Node.js',
        text: 'This is the email content.',
      };
      
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error('Error sending email:', error);
        } else {
          console.log('Email sent:', info.response);
        }
      });



    // smtpProtocol = mailer.createTransport({
    //     service: "Gmail",
    //     auth: {
    //         user: "ahuvael02@gmail.com",
    //         pass: "0527116839"
    //     }
    // });

    // var mailoption = {
    //     from: "ahuvael02@gmail.com",
    //     to: "ahuvael02@gmail.com",
    //     subject: "Test Mail",
    //     html: 'Good Morning!'
    // }

    // smtpProtocol.sendMail(mailoption, function (err, response) {
    //     if (err) {
    //         console.log(err);
    //     }
    //     // console.log('Message Sent' + response.message);
    //     smtpProtocol.close();
    // });
});

module.exports = router;