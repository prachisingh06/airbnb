const { string } = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
   
    rating : {
        type:Number,
        min:1,
        max:5,
    },
    createdAt:{
        type: Date,
        default: Date.now()
    },
    comment:
    {
        type:String,
        require:true,

    },
  
});

module.exports = mongoose.model("Review", reviewSchema);
