const User = require("../models/user");

module.exports.renderSignupForm=(req, res) => {
    res.render("users/signup");
};

module.exports.renderLoginForm= (req, res) => {
    res.render("users/login.ejs");
};

module.exports.signup= async (req, res) => {
    try{
         let { username, email, password } = req.body;
    const newUser = new User({ username, email });
    const registeredUser = await User.register(newUser, password);
    console.log(registeredUser);
    req.login(registeredUser, (err) => {
        if (err) {
            return next(err);
        }
          req.flash("success", "Welcome to Wanderlust!");
    res.redirect("/listings");
    });
    }   catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
};

module.exports.login =   async(req, res) => {
    req.flash("success", "Welcome back!");
    res.redirect(res.locals.redirectUrl || "/listings");
};

module.exports.logout =  (req, res,next) => {
    req.logout((err) => {   
        if (err) {
            return next(err);
        }
        req.flash("success", "Goodbye!");
        res.redirect("/listings");
    });
};
