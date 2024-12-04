const Listing = require("./models/listing");
const {listingSchema, reviewSchema} = require("./schema.js");
const ExpressError  = require("./utils/ExpressError.js");

module.exports.login= (req,res, next) =>{
    if(!req.isAuthenticated()){
        console.log(req.path,".." ,req.originalUrl);
        //redirectUrl save
        req.session.redirectUrl = req.originalUrl;
        req.flash("error","you must be logged in to create listing");
        return res.redirect("/login");
    }
    next();
};

module.exports.saveRedirectUrl = ( req,res, next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl= req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner = async(req, res, next) =>{
    let{id}= req.params;
    let listing = await Listing.findById(id);
    const currUser = req.user || res.locals.currUser; // Access currUser from appropriate location
  
    if (!currUser || !listing.owner.equals(currUser._id)) {
     req.flash("error", "You are not the owner of this listing");
   return res.redirect(`/listings/${id}`);
     }
     next();
};

// validate listing
module.exports.validateListing = (req,res, next) =>{
    let {error}= listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    }else{
        next();
    }
};

// validate review 
module.exports.validateReview= (req,res, next) =>{
    let {error}= reviewSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    }else{
        next();
    };
};


