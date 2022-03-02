const express = require("express");
const MongoClient = require("mongodb").MongoClient;
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("./models/user");
const app = express();
const port = 3000;

// create connection for mongo using mongoose module
// if the db do not exists the mongoose creates the db for you
mongoose.connect("mongodb://localhost:27017/twitterClone");

app.use(express.static("public"));
app.set("view engine", "ejs");

// by this method we are parsing the form info in json format to DB (mongo)
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// here we render the signup page

app.get("/", (req, res) => {
  User.find({}).exec((err, result) => {
    const data = result;
    console.log(result);
    res.render("index", { data });
  });
});

// here we render the login page

app.get("/login", (req, res) => {
  res.render("login");
});

// create a middleware function which checks if the user is logged in

function checkUserLoginStatus(req, res, next) {
  const status = false;
  if (status) {
    next();
  } else {
    res.send("please login first to continue to secret page");
  }
}

// here we render the secret page

app.get("/secret", checkUserLoginStatus, (req, res) => {
  res.render("secret");
});

// here we perform the post request for sign up
// we collect the data for signup and store it to the database

app.post("/signup", (req, res) => {
  const data = req.body;
  console.log(data);

  const plainPassword = data.password;
  const user = new User();

  bcrypt.hash(plainPassword, 10, (err, hash) => {
    console.log(hash);
    const hashedPassword = hash;
    user.name = data.name;
    user.email = data.email;
    user.password = hashedPassword;
    user.birthDate = data.birthDate;

    user.save((err, result) => {
      // console.log(result);
      res.send("data added succesfully");
    });
  });
});

// we collect the data for login and we check the email and password against the database

app.post("/login", (req, res) => {
  const data = req.body;
  console.log(data);

  const plainPassword = data.password;
  const email = data.email;

  const fieldsToBeChecked = {
    email: email,
  };

  //TODO: in fieldsToBeChecked we have to pass a hashed password

  User.find(fieldsToBeChecked).exec((err, foundUser) => {
    const hashedPassword = foundUser[0].password;

    if (foundUser.length > 0) {
      console.log("user found");
      bcrypt.compare(plainPassword, hashedPassword, function (err, result) {
        if (result) {
          res.redirect("/secret");
        } else {
          res.send(
            "<h1>your email or password was incorrect so the account was not found in the data base</h1>"
          );
        }
      });
    } else {
      console.log("Data not found");
    }
  });
});

app.listen(port, () => console.log("server started on port"));
