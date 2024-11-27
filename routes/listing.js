const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const {listingSchema, reviewSchema} = require("../schema.js");
const ExpressError  = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
const {login} = require("../middleware.js");

// validate listing
const validateListing = (req,res, next) =>{
    let {error}= listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    }else{
        next();
    }
};


//index route
router.get("/", wrapAsync( async(req,res) =>{
    const allListings = await Listing.find({});
    res.render("listings/index.ejs",{allListings});
    }));
    
    //new routh
    router.get("/new",login,(req,res)=>{
        res.render("listings/new.ejs")
    });
    
    
//show route
    router.get("/:id", wrapAsync( async(req,res)=>{
      let {id} = req.params;
      const listing = await Listing.findById(id).populate("reviews");
      if(!listing){
        req.flash("error","Listing you requested for does not exist! ")
        res.redirect("/listings");
      }
         res.render("listings/show.ejs",{listing});
      
    }));

//create route
 router.post("/",
    login,
    validateListing,
    wrapAsync( async(req,res,next)=>{
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    req.flash("success","New Listing Created!");
    res.redirect("/listings");
    
})
);

//edit route
router.get("/:id/edit",login, wrapAsync( async(req,res) =>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing you requested for does not exist!")
        res.redirect("/listings")
    }
     res.render("listings/edit.ejs",{listing});

}));

//update Route
router.put("/:id",
    login,
    validateListing,
    wrapAsync( async(req,res) =>{
    let {id }  = req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    req.flash("success","listing updated");

    res.redirect(`/listings/${id}`);

}));

//delete route
router.delete("/:id", login,wrapAsync( async(req, res)=>{
    let {id} =req.params;
    let deleteListing =  await Listing.findByIdAndDelete(id);
    console.log(deleteListing);
    req.flash("success","Delete listing");

    res.redirect("/listings");
    
}));

module.exports = router;