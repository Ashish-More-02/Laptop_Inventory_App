const mongoose = require("mongoose");
const { applyTimestamps } = require("../models/LaptopModel");
const Laptop = require("../models/LaptopModel");
const { Schema, model } = mongoose;

// define schema
const userSchema = new Schema(
  {
    name: String,
    email: String,
    password: String,
  },
  { timestamps: true },
);


// compile it into model ,
const User = model("User",userSchema);


module.exports = User;



const laptopSchema = new Schema({
    name:String,
    createdBy:{
        type: Schema.Types.ObjectId,
        ref:"User",
    },
});

const Laptop = model("Laptop",laptopSchema);

module.exports = Laptop;



// reading the reference from laptop model 

const laptopData = await Laptop.findById(id).populate("createdBy", "name email");