const createError = require("http-errors");
const User = require("../models/user");

// firstName, lastName, userName, password, gender, role;

const login = async (req, res, next) => {
  try {
    const allUser = User.find({});
    const user = await User.findOne({ userName: req.body.userName });
    if (!user) return res.redirect("/login?errorMessage=User not !`");

    const isMatch = await user.validatePassword(req.body.password);
    if (!isMatch) return res.redirect("/login?errorMessage=User pass!");
    req.session.user = user;

    res.redirect("/user/profile-page");
  } catch (error) {
    // res.redirect("/login?errorMessage=serverError for login");
    console.log(error);
  }
};

const loginPageRender = (req, res, next) => {
  if (req.session.user) res.render("pages/dashboard");

  res.render("pages/login");
};

const signup = async (req, res, next) => {
  const newUser = new User({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    userName: req.body.userName,
    password: req.body.password,
    gender: req.body.gender,
    role: req.body.role,
  });
  console.log(newUser);

  try {
    const savedUser = await newUser.save();
    // res.send(savedUser);
    // res.send("user register");
    res.redirect("/user/login-page");
  } catch (error) {
    res.redirect("/signup?errorMessage=serverError for signup");

    console.log(error);
  }
};

const signupPageRender = (req, res, next) => {
  res.render("pages/signup.ejs");
};

const profile = async (req, res, next) => {
  if (!req.session.user) return res.send("you most be register");

  res.render("pages/dashboard", { user: req.session.user });
};

const logout=(req,res,next)=>{
  req.session.destroy()

  res.redirect("/user/login-page")
}

module.exports = { login, loginPageRender, signup, signupPageRender, profile,logout };
