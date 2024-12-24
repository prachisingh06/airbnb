const express = require("express");
const router = express.Router({mergeParams :true});
const wrapAsync = require("../utils/wrapAsync.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const {validateReview, login, isReviewAuthor} = require("../middleware.js")

const reviewController = require("../controllers/reviews.js");
//post route
router.post("/", 
   login,
   validateReview,
    wrapAsync( reviewController.createReview ));
  
  //delete revirw route
router.delete("/:reviewId",
  login,
  isReviewAuthor,
  wrapAsync(reviewController.destoryReview));
  

module.exports = router;