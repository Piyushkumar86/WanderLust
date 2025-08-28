const express = require("express");
const router = express.Router();
const wrapAsyc = require("../utils/wrapAsyc.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controllers/users.js");
const user = require("../models/user.js");


router.route("/signup")
.get(userController.renderSignupForm)
.post(wrapAsyc(userController.signup));

router.route("/login")
.get(userController.renderLoginForm)
.post(saveRedirectUrl,
     passport.authenticate("local",
         { failureFlash: true,failureRedirect: "/login"}),userController.login);
    
router.get("/logout",userController.logout);

module.exports = router;