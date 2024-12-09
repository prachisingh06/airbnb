const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const {login , isOwner, validateListing} = require("../middleware.js");

const listingController = require("../controllers/listings.js");

//index route
router.get("/", wrapAsync( listingController.index ));
    
//new routh
router.get("/new",login,listingController.renderNewFrom);
    
    
//show route
    router.get("/:id", wrapAsync( listingController.showListing));

//create route
 router.post("/",
    login,
    validateListing,
    wrapAsync(listingController.createListing )
);

//edit route
router.get("/:id/edit",login,isOwner, wrapAsync(listingController.renderEditListing ));

//update Route
router.put("/:id",
    login,
    validateListing,
    isOwner,
    wrapAsync(listingController.updateListing ));

//delete route
router.delete("/:id",
     login,
     isOwner,
     wrapAsync( listingController.destroyListing));

module.exports = router;