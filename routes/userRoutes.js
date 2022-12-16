const router = require("express").Router();
const User = require("../models/User");
const validator = require("email-validator");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const transporter = require("../nodemailer/transporter");
// CREATE
router.post("/register", async (req, res) => {
  try {
    if (!validator.validate(req.body.email))
      return res.status(500).json("invalid email");
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
    });
    await newUser.save();
    // async email
    jwt.sign(
      {
        user: newUser._id,
      },
      "ThisIsASecret",
      { expiresIn: "1d" },
      (err, emailToken) => {
        const url = `http://localhost:5000/confirmation/${emailToken}`;
        console.log(url);

        // using node-mailer
        // transporter.sendMail(
        //   {
        //     to: newUser.email,
        //     from: "nodemailer2608@zohomail.in",
        //     subject: "Confirm Email",
        //     html: `Please click this url to confirm your email: <a href="${url}">Click!</a>`,
        //   },
        //   (err, info) => {
        //     if (err) console.log(err);
        //     else console.log(info.response);
        //   }
        // );

        // using sendgrid

        const message = {
          to: newUser.email,
          from: process.env.USER,
          subject: "Confirm Email",
          html: `Please click this url to confirm your email: <a href="${url}">Click!</a>`,
        };
        sgMail.send(message);
      }
    );
    res.status(200).json("user created");
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  try {
    const user = await User.findOne({ username, password });
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
