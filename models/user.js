const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
    },
});

// Adding Passport-Local Mongoose plugin to the schema
userSchema.plugin(passportLocalMongoose);

// Correctly exporting the model
module.exports = mongoose.model('User', userSchema);
