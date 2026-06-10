const mongoose = require("mongoose");
const {model , Schema} = mongoose;


const userSchema = new Schema({
    name:{
        type:String,
    },
    email:{
        type:String,
        required:true,
        unique: true
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        enum:["user","admin"],
        default:"user"
    }
})

// while creating a model , give the model name and provide a schema to it.
const User = model("User",userSchema)

module.exports = {
    User
}
