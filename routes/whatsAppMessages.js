const express = require('express');
const twilio = require('twilio');
const router = express.Router();


const accountSid = 'AC3722681d483e9f7774d7bca9a8db63df';
const authToken = '5198b8726dc64ccbec3282e87f5f235b';
const client = twilio(accountSid, authToken);

router.post('/', (req, res) => {
  let { to, message } = req.body;
  to = "527116839"
  client.messages
    .create({
      body: message,
      from: '+13613663512',
      to: `+972${to}`,
    })
    .then((message) => {
      console.log('Message sent:', message.sid);
      res.json({ success: true });
    })
    .catch((error) => {
      console.error('Error sending message:', error);
      res.status(500).json({ success: false, error: error.message });
    });
});

module.exports = router;


