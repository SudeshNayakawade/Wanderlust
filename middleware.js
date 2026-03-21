const Listing = require("./models/listing");
const Review = require("./models/review");

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl; // this will store the url that the user is trying to access in the session, so that we can redirect them back to that url after they log in
        req.flash("error", "You must be signed in to do that!");
        return res.redirect("/login");
    }
    next();
}

module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl; // this will make the redirectUrl available in the locals, so that we can use it in the login route to redirect the user back to the url they were trying to access
    }
    next();
}

module.exports.isOwner =async (req, res, next) => {
    // this middleware will check if the user is the owner of the listing before allowing them to edit or delete it
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner.equals(res.locals.currentUser._id)){
        // if the user is not the owner of the listing, we will flash an error message and redirect them back to the listing page
        req.flash("error", "You don't have permission to do that!");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.isReviewAuthor = async (req, res, next) => {
    // this middleware will check if the user is the author of the review before allowing them to delete it
    let { id, reviewId } = req.params;
    let review = await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currentUser._id)){
        // if the user is not the author of the review, we will flash an error message and redirect them back to the listing page
        req.flash("error", "You don't have permission to do that!");
        return res.redirect(`/listings/${id}`);
    }
    next();
}