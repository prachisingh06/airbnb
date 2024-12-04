const express= require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError  = require("./utils/ExpressError.js");
const session = require("express-session");
const listingsRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/review.js");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const UserRouter = require("./routes/user.js");


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
    // res.render("listings/index.ejs",{allListings});
    res.send("hhhhhhhhh")
});

app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error= req.flash("error");
    res.locals.currUser = req.user;
    next();
});


app.use("/listings",listingsRouter);
app.use("/listings/:id/reviews", reviewsRouter);
app.use("/" ,UserRouter);

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

