// const express = require('express');
// const twilio = require('twilio');
// const router = express.Router();


// const accountSid = 'AC3722681d483e9f7774d7bca9a8db63df';
// const authToken = '5198b8726dc64ccbec3282e87f5f235b';
// const client = twilio(accountSid, authToken);

// router.post('/', (req, res) => {
//   let { to, message } = req.body;
//   // to = "527116839"
//   console.log(to)
//   client.messages
//     .create({
//       body: message,
//       from: '+13613663512',
//       to: `+972${to}`,
//     })
//     .then((message) => {
//       console.log('Message sent:', message.sid);
//       res.json({ success: true });
//     })
//     .catch((error) => {
//       console.error('Error sending message:', error);
//       res.status(500).json({ success: false, error: error.message });
//     });
// });

// module.exports = router;

// // const venom = require('venom-bot');
// // const express = require('express');
// // const router = express.Router();

// // router.post('/', (req, res) => {
// //   venom.create().then((client) => start(client));

// //   const start = (client) => {
// //     // Send a WhatsApp message
// //    console.log(req.body)
// //     client.sendText('RECIPIENT_PHONE_NUMBER', 'Hello from venom!')
// //       .then(() => {
// //         console.log('Message sent successfully!');
// //         client.close();
// //       })
// //       .catch((error) => {
// //         console.error('Error sending message:', error);
// //         client.close();
// //       });
// //   }
// // });

// // module.exports = router;

const express = require('express');
const router = express.Router();
const { Vonage } = require('@vonage/server-sdk')

const vonage = new Vonage({
  apiKey: "d3b1c05c",
  apiSecret: "Cktr1VXBczekH9RR"
})

router.post('/', async (req, res) => {
  const from = "Vonage APIs"
  const to = "972525990327"
  const text = 'A text message sent using the Vonage SMS API'

  await vonage.sms.send({ to, from, text })
    .then(resp => { console.log('Message sent successfully'); console.log(resp); })
    .catch(err => { console.log('There was an error sending the messages.'); console.error(err); });

});

module.exports = router;
