const express = require("express");
const router = express.Router();
const wrapAsyc = require("../utils/wrapAsyc.js");
const {isLoggedIn, isOwner,validateListing} = require("../middleware.js");
const listingController=require("../controllers/listings.js");
const multer = require("multer");
const { cloudinary, storage } = require("../cloudConfig.js");
const upload = multer({ storage }); // Configure multer to store files in 'uploads' directory


router.route("/")
.get(wrapAsyc(listingController.index))
.post(
    isLoggedIn,
    upload.single("listing[image]"), 
    validateListing,
    wrapAsyc(listingController.createListing));

// New route
router.get("/new",isLoggedIn,listingController.renderNewForm);

router.route("/:id")
.get(wrapAsyc(listingController.showListing))
.put(isLoggedIn,isOwner,upload.single("listing[image]"),validateListing,wrapAsyc(listingController.updateListing))
.delete(isLoggedIn,isOwner,wrapAsyc(listingController.deleteListing));

//edit route
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsyc(listingController.renderEditForm));

module.exports = router;
