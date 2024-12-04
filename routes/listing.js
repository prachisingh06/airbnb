const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const {login , isOwner, validateListing} = require("../middleware.js");



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
      const listing = await Listing.findById(id)
      .populate("reviews")
      .populate("owner")
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
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success","New Listing Created!");
    res.redirect("/listings");
    
})
);

//edit route
router.get("/:id/edit",login,isOwner, wrapAsync( async(req,res) =>{
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
    isOwner,
    wrapAsync( async(req,res) =>{
    let {id }  = req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    req.flash("success","listing updated");
    res.redirect(`/listings/${id}`);

}));

//delete route
router.delete("/:id",
     login,
     isOwner,
     wrapAsync( async(req, res)=>{
    let {id} =req.params;
    let deleteListing =  await Listing.findByIdAndDelete(id);
    console.log(deleteListing);
    req.flash("success","Delete listing");

    res.redirect("/listings");
    
}));

module.exports = router;