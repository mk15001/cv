const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

app.post("/send", (req, res) => {
  const { name, email, phone, subject, message } = req.body;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS // <- make sure this matches your .env
    }
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,    // sender = your Gmail
    to: process.env.EMAIL_USER,      // receiver = yourself
    replyTo: email,                  // reply goes to user who filled the form
    subject: `[Contact Form] ${subject}`,
    html: `
      <h3>New message from ${name}</h3>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      <p><strong>Message:</strong><br>${message}</p>
    `
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("❌ Error sending mail:", error);
      return res.status(500).send("Failed to send message.");
    }
    console.log("✅ Email sent:", info.response);
    res.send("Message sent successfully!");
  });
});

app.listen(3000, () => {
  console.log("🚀 Server running on http://localhost:3000");
});
