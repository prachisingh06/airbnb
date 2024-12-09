const express = require("express");
const router = express.Router({mergeParams :true});
const wrapAsync = require("../utils/wrapAsync.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const {validateReview, login, isReviewAuthor} = require("../middleware.js")


//post route
router.post("/", 
   login,
   validateReview,
    wrapAsync( async(req, res) =>{
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;   
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success"," Review send!");

    res.redirect(`/listings/${listing._id}`);
    
  
  }));
  
  //delete revirw route
router.delete("/:reviewId",
  login,
  isReviewAuthor,
  wrapAsync(async(req, res)=>{
     let {id, reviewId} = req.params;
  
     await Listing.findByIdAndUpdate(id, {$pull:{ reviews :reviewId}});
     await Review.findByIdAndDelete(reviewId);
     req.flash("success","Review delete");

     res.redirect(`/listings/${id}`);
  
  }));
  

module.exports = router;