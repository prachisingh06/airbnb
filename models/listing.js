const mongoose = require("mongoose");
const Review = require("./review.js");
const User= require("./user.js");

const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title:
    {
        type:String,
        require:true,

    },
    description:String,
    image:{
        type:String,
        default:"https://wallup.net/wp-content/uploads/2019/05/10/468821-vacation-beach-summer-tropical-sea-palms-paradise-ocean-1.jpg",
        set:(v) => v===""?
        "https://wallup.net/wp-content/uploads/2019/05/10/468821-vacation-beach-summer-tropical-sea-palms-paradise-ocean-1.jpg" 
        : v,
    },
    price:Number,
    location:String,
    country:String,
    reviews: [
        {
            type:Schema.Types.ObjectId,
            ref:"Review",


        },
    ],

    owner:{
        type: Schema.Types.ObjectId,
        ref:"User",

    }
    
});

listingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
 await Review.deleteMany({_id: {$in: listing.reviews}});
    }
})

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;