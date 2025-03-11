const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

// Email configuration
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'your-email@gmail.com', // Replace with your email
        pass: 'your-email-password' // Replace with your email password
    }
});

// Endpoint to send questionnaire
app.post('/send-questionnaire', (req, res) => {
    const { agency, agencyRef, forename, surname, email } = req.body;

    const mailOptions = {
        from: 'your-email@gmail.com', // Replace with your email
        to: email,
        subject: 'Questionnaire',
        text: `Hello ${forename} ${surname},\n\nPlease fill out the attached questionnaire.\n\nAgency: ${agency}\nAgency Ref: ${agencyRef}\n\nThank you!`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return res.status(500).send(error.toString());
        }
        res.status(200).send('Questionnaire sent successfully!');
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
