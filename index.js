const express = require("express");
const mongoose = require("mongoose");
const userRoutes = require("./routes/userRoutes");
const jwt = require("jsonwebtoken");
const User = require("./models/User");
const dotenv = require("dotenv");
mongoose
  .connect(
    "mongodb+srv://Nishchay:Nishchay123@cluster0.riinp.mongodb.net/emailVerificationDemo"
  )
  .then(() => console.log("connected to mongodb"))
  .catch((err) => console.log(err));
const app = express();
const PORT = process.env.PORT || 5000;
dotenv.config();
app.use(express.json());
app.get("/confirmation/:token", async (req, res) => {
  try {
    const userId = jwt.verify(req.params.token, "ThisIsASecret");
    console.log(userId.user);
    await User.updateOne({ _id: userId.user }, { confirmed: true });
  } catch (err) {
    res.status(500).json(err);
  }
});
app.use("/user", userRoutes);
app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
