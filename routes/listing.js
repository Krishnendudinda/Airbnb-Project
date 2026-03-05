const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const { storage } = require("../cloudConfig.js");
const multer  = require('multer');
const upload = multer({ storage });



const ListingController = require("../controllers/listings.js");

router.route("/")
    .get(wrapAsync(ListingController.index)) //Index Route
    .post(isLoggedIn, upload.single('listing[image]'), validateListing, wrapAsync(ListingController.createListing)); //Create Route

//wrapAsync is used to catch the error and pass it to the error handling middleware 

//New Route
router.get("/new",isLoggedIn, ListingController.renderNewForm);


router.route("/:id")
    .get(isLoggedIn, wrapAsync(ListingController.showListing)) //Show Route
    .patch(isLoggedIn, isOwner,upload.single('listing[image]'), validateListing, wrapAsync(ListingController.updateListing)) //Update Route
    .delete(isLoggedIn,isOwner, wrapAsync(ListingController.destroyListing))//Delete Route


//Edit Route
router.get("/:id/edit",isLoggedIn,isOwner, wrapAsync (ListingController.renderEditForm));


router.get("/search/:searchId",isLoggedIn, wrapAsync(ListingController.searchListings));//Search Route

module.exports = router;