const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/WrapAsync.js");
const { listingSchema } = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
const { isLoggedIn } = require("../middleware.js");
const { isOwner } = require("../middleware.js");

const listingController = require("../controllers/listings.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

const validateListing = (req, res, next) => {
    let result = listingSchema.validate(req.body);
    console.log(result);
    if (result.error) {
        let msg = result.error.details.map(el => el.message).join(",");
        throw new ExpressError(400, msg);
    }else{
        next();
    }
}

//Index route
router.get("/", wrapAsync(listingController.index));

//new route
router.get("/new",isLoggedIn, listingController.renderNewForm);

//Create route
router.post("/",isLoggedIn, upload.single("listing[image]"),validateListing, wrapAsync(listingController.createListing));

//edit route
router.get("/:id/edit",isLoggedIn,isOwner, wrapAsync(listingController.editlisting));

//show route
router.get("/:id", wrapAsync(listingController.showListing));

//update route
    router.put("/:id",isLoggedIn,isOwner, validateListing, wrapAsync(listingController.updateListing));

//Delete route
router.delete("/:id",isLoggedIn,isOwner, wrapAsync(listingController.deleteListing));

module.exports = router;