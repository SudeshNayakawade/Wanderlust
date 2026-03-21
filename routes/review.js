const express = require('express');
const router = express.Router({ mergeParams: true });
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/WrapAsync.js");
const { reviewSchema } = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
const Review = require("../models/review.js");
const { isLoggedIn, isReviewAuthor } = require('../middleware.js');

const reviewController = require("../controllers/reviews.js");

const validateReview = (req, res, next) => {
    let result = reviewSchema.validate(req.body);
    // console.log(result);
    if (result.error) {
        let msg = result.error.details.map(el => el.message).join(",");
        throw new ExpressError(400, msg);
    }else{
        next();
    }
}

// POST Review route
router.post("/",isLoggedIn, validateReview, wrapAsync(reviewController.createReview));

// Delete Review route
router.delete("/:reviewId",isLoggedIn,isReviewAuthor, wrapAsync(reviewController.deleteReview));

module.exports = router;