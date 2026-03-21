const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose").default; // this will add the username and password fields to the schema and also add some methods for hashing and salting the password

const userSchema = new Schema({
    username:{
        type: String,
        required: true,
        unique: true
    },
    
    // here we not defining email and password because passport-local-mongoose will add these fields to the schema for us, we just need to specify the username field and it will handle the rest

    // email:{
    //     type: String,
    //     required: true,
    //     unique: true
    // },
    // password:{
    //     type: String,
    //     required: true
    // },

})

userSchema.plugin(passportLocalMongoose); // this will add the username and password fields to the schema and also add some methods for hashing and salting the password

const User = mongoose.model("User", userSchema);
module.exports = User;