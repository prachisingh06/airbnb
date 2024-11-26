const express= require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError  = require("./utils/ExpressError.js");
const session = require("express-session");
const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");
const flash = require("connect-flash");


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

const sessionOption ={
    secret:"mysecrtcode",
    resave: false,
    saveUninitialized:true,
    cookie: {
        expires: Date.now() +7 *24 *60 *60 * 1000,
        maxAge:7 *24 *60 *60 * 1000,
        httpOnly:true,
    },
};

app.get("/", async(req,res)=>{
    const allListings = await Listing.find({});
    res.render("listings/index.ejs",{allListings});
});

app.use(session(sessionOption));
app.use(flash());

app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    next();
});

app.use("/listings",listings);
app.use("/listings/:id/reviews", reviews);

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

