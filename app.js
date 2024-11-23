const express= require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError  = require("./utils/ExpressError.js");
const {listingSchema, reviewSchema} = require("./schema.js");
const Review = require("./models/review.js");
const { log } = require("console");

const listings = require("./routes/listing.js");

main().then(()=>{
    console.log("connected to db");
    
}).catch((err) =>{
 console.log(err); 
})
async function main(){
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}

app.set("view engine", "ejs");
app.set("views", path.join( __dirname,"views"));
app.use(express.urlencoded({extended:"true"}))
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

app.get("/", async(req,res)=>{
    const allListings = await Listing.find({});

    res.render("listings/index.ejs",{allListings});
});

// validate listing
const validateListing = (req,res, next) =>{
    let {error}= listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    }else{
        next();
    }
}

app.use("/listings",listings);

//review schema
const validateReview= (req,res, next) =>{
    let {error}= reviewSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    }else{
        next();
    }
}



//index route
app.get("/listings", wrapAsync( async(req,res) =>{
const allListings = await Listing.find({});
res.render("listings/index.ejs",{allListings});
}));

//new routh
app.get("/listings/new",(req,res)=>{
    res.render("listings/new.ejs");
});


//show route
app.get("/listings/:id", wrapAsync( async(req,res)=>{
  let {id} = req.params;
  const listing = await Listing.findById(id).populate("reviews");
     res.render("listings/show.ejs",{listing});
}));


//create route
app.post("/listings",
    validateListing,
     wrapAsync( async(req,res,next)=>{
    
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
    
})
);

//edit route
app.get("/listings/:id/edit", wrapAsync( async(req,res) =>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
     res.render("listings/edit.ejs",{listing});

}));

//update Route
app.put("/listings/:id",
    validateListing,
    wrapAsync( async(req,res) =>{
    let {id }  = req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    res.redirect(`/listings/${id}`);

}));

//delete route
app.delete("/listings/:id", wrapAsync( async(req, res)=>{
    let {id} =req.params;
    let deleteListing =  await Listing.findByIdAndDelete(id);
    console.log(deleteListing);
    res.redirect("/listings");
    
}));

//review
//post route
app.post("/listings/:id/reviews",  validateReview, wrapAsync( async(req, res) =>{
  let listing = await Listing.findById(req.params.id);
  let newReview = new Review(req.body.review);

  listing.reviews.push(newReview);
  await newReview.save();
  await listing.save();
  res.redirect(`/listings/${listing._id}`);
  

}));

//delete revirw route
app.delete("/listings/:id/reviews/:reviewId", wrapAsync(async(req, res)=>{
   let {id, reviewId} = req.params;

   await Listing.findByIdAndUpdate(id, {$pull:{ reviews :reviewId}});
   await Review.findByIdAndDelete(reviewId);
   res.redirect(`/listings/${id}`);

}));

app.all("*",(req,res, next)=>{
    next(new ExpressError(400, "Page not found!"));
});

app.use((err, req, res, next) =>{
    let{statuscode=500 , message="Something went wrong"} = err;
    res.status(statuscode).render("error.ejs" ,{err});
    // res.status(statuscode).send(message);
});



app.listen(8000, ()=>{
    console.log("serveris listening to part 8000");
    
});

