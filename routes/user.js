const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const {saveRedirectUrl} = require("../middleware.js");

const userControllers = require("../controllers/user.js")

router.get("/signup", userControllers.renderSignupForm);

router.post("/signup", wrapAsync(userControllers.signup));
   

//login router
router.get("/login", userControllers.renderLoginFrom )

//post login router
router.post("/login",saveRedirectUrl, passport.authenticate("local",
    {
        failureRedirect:'/login',
        failureFlash:true

    }),
    userControllers.login
    );

//logeout router
router.get("/logout",userControllers.logout);

module.exports = router;
