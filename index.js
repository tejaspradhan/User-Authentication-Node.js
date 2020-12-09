const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const User = require("./UserSchema.js");
const bcrypt = require("bcrypt");
const app = express();

app.use(bodyParser.json());
app.use(express.static("public"));

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app
  .get("/", (req, res) => {
    return res.redirect("login.html");
  })
  .listen(3000);

console.log("Server Started on PORT 3000");

// setting up the mongo db connection
mongoose.set("useNewUrlParser", true);
mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);

// above lines are for removing warnings

mongoose.connect("mongodb://localhost:27017/UsersDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", () => console.log("Error in Connecting to Database"));
db.once("open", () => console.log("Connected to Database"));

// sign-up endpoint
app.post("/sign_up", async (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const sport = req.body.sport;

  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const data = {
      name: name,
      email: email,
      sport: sport,
      password: hashedPassword,
      type: 1,
    };

    User.create(data, (err, data) => {
      if (err) {
        throw err;
      }
      console.log(data);
      console.log("Record Inserted Successfully");
    });

    return res.redirect("signup_success.html");
  } catch {
    console.log("Error in inserting record");
  }
});

// login endpoint
app.post("/login", async (req, res) => {
  const username = req.body.inputEmail;
  const password = req.body.inputPassword;

  // console.log(username + " " + password);

  User.findOne({ email: username }, async (err, user) => {
    //  status codes -- 1 success, 2 not found, 3 incorrect password
    if (user === null) {
      res.json({ status: 2 }); // User not Found
    }

    try {
      // Login successful
      if (await bcrypt.compare(password, user.password)) {
        res.json({ status: 1, name: user.name, sport: user.sport });
      } else res.json({ status: 3 }); // Incorrect Password
    } catch {
      res.json({ status: -1 }); // unknown error
    }
  });
});
