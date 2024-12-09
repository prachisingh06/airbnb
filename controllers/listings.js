const Listing = require("../models/listing");


//index routh
module.exports.index = async(req,res) =>{
    const allListings = await Listing.find({});
    res.render("listings/index.ejs",{allListings});
};

//mew routh
module.exports.renderNewFrom = (req,res)=>{
    res.render("listings/new.ejs")
};

//show routh
module.exports.showListing = async(req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id)
    .populate({
      path:"reviews",
      populate:{
          path:"author",    
      },
    })
    .populate("owner")
    if(!listing){
      req.flash("error","Listing you requested for does not exist! ")
      res.redirect("/listings");
    }
    
       res.render("listings/show.ejs",{listing});
    
  };

//create routh 
module.exports.createListing= async(req,res,next)=>{
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success","New Listing Created!");
    res.redirect("/listings");
    
};

//edit routh 
module.exports.renderEditListing = async(req,res) =>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing you requested for does not exist!")
        res.redirect("/listings")
    }
     res.render("listings/edit.ejs",{listing});

};

//update routh
module.exports.updateListing =async(req,res) =>{
    let {id }  = req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    req.flash("success","listing updated");
    res.redirect(`/listings/${id}`);

};


//delete routh
module.exports.destroyListing =async(req, res)=>{
    let {id} =req.params;
    let deleteListing =  await Listing.findByIdAndDelete(id);
    console.log(deleteListing);
    req.flash("success","Delete listing");

    res.redirect("/listings");
    
}
