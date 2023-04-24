const express = require("express");
const router = express.Router();
const {
  login,
  loginPageRender,
  signup,
  signupPageRender,
  profile,
  logout
} = require("../controller/userController");

router.post("/login", login);
router.get("/login-page",loginPageRender)

router.post("/signup", signup);
router.get("/signup-page", signupPageRender);

router.get("/profile-page", profile);

router.get("/logout",logout)

module.exports = router;
