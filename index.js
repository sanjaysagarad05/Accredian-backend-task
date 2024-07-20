const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); // Import the cors package
const { PrismaClient } = require('@prisma/client');
const nodemailer = require('nodemailer');
require('dotenv').config();

// const prisma = new PrismaClient();

// prisma.$connect()
//   .then(() => {
//     console.log('Connected to the database');
//   })
//   .catch((error) => {
//     console.error('Error connecting to the database', error);
//   });

const app = express();
const PORT = process.env.PORT || 9000;

app.use(bodyParser.json());
app.use(cors()); 


const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

const sendEmail = (mailOptions) => {
    return new Promise((resolve, reject) => {
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error('Error sending email', error);
          reject(error);
        } else {
          resolve(info);
        }
      });
    });
  };

app.get('/', (req, res) => {
    res.send('Welcome to the Referral Program API');
});


// app.post('/api/referrals', async (req, res) => {
//   const { referrerName, referrerEmail, refereeName, refereeEmail } = req.body;

//   // Form validation
//   if (!referrerName || !referrerEmail || !refereeName || !refereeEmail) {
//     return res.status(400).json({ error: 'All fields are required' });
//   }

//   try {
//     // Save referral data to the database
//     // const newReferral = await prisma.referral.create({
//     //   data: { referrerName, referrerEmail, refereeName, refereeEmail },
//     // });

//     // Send email notification
//     const mailOptions = {
//         from: process.env.GMAIL_USER,
//         to: refereeEmail,
//         subject: 'You have been referred!',
//         text: `Hi ${refereeName},\n\n${referrerName} has referred you. Please check out our program.`,
//     };
    

    

//     if(sendEmail(mailOptions))
//     {
//         return res.status(200).json({ message: 'Referral submitted successfully' });
//     }
//     else{
//         debugger
//         return res.status(500).json({ message: 'Error sending email' });
//     }

//   } catch (error) {
//     // return res.status(500).json({ "error": `An error occurred while processing your request- ${error}` });
//     console.log("An error occurred while processing your request", error);
//   }
// });

app.post('/api/referrals', async (req, res) => {
    const { referrerName, referrerEmail, refereeName, refereeEmail } = req.body;
  
    // Form validation
    if (!referrerName || !referrerEmail || !refereeName || !refereeEmail) {
      return res.status(400).json({ error: 'All fields are required' });
    }
  
    try {
      // Save referral data to the database
      // Uncomment and use this line once Prisma setup is confirmed to be working
      // const newReferral = await prisma.referral.create({
      //   data: { referrerName, referrerEmail, refereeName, refereeEmail },
      // });
  
      // Send email notification
      const mailOptions = {
        from: process.env.GMAIL_USER,
        to: refereeEmail,
        subject: 'You have been referred!',
        text: `Hi ${refereeName},\n\n${referrerName} has referred you. Please check out our program.`,
      };
  
      try {
        await sendEmail(mailOptions);
        return res.status(200).json({ message: 'Referral submitted successfully' });
      } catch (emailError) {
        console.error('Error sending email', emailError);
        return res.status(500).json({ error: 'Error sending email' });
      }
  
    } catch (dbError) {
      console.error('An error occurred while processing your request', dbError);
      return res.status(500).json({ error: 'An error occurred while processing your request' });
    }
  });
  


app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
