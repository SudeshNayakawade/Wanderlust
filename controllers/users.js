const User = require("../models/user.js"); 

module.exports.renderSignupForm = (req, res) => {
    res.render("users/signup.ejs");
}

module.exports.signup = async (req, res) => {
    try{
      let {username, email, password} = req.body;
    const newUser = new User({username, email});
    await User.register(newUser, password);
    req.login(newUser, (err) => {
        if(err){
            req.flash("error", "Error logging in after signup");
            return res.redirect("/login");
        }
        req.flash("success", "Welcome to Wanderlust");
        res.redirect("/listings");
    });
    }catch(e){
        req.flash("error", e.message);
        res.redirect("/signup");
    }
}

module.exports.renderLoginForm = (req, res) => {
    res.render("users/login.ejs");
}

module.exports.login =  async (req, res) => {
    req.flash("success", "Welcome back to Wanderlust");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
}

module.exports.logout = (req, res) => {
    req.logout((err) => {
        if (err) {
            req.flash("error", "Error logging out");
            return res.redirect("/listings");
        }   
        req.flash("success", "Logged out successfully");
        res.redirect("/listings");
    });
}