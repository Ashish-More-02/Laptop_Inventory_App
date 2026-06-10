const mongoose = require("mongoose");
const {model, Schema,ObjectId} = mongoose;


const laptop = new Schema({
    name:String,
    brand:String,
    price:Number,
    specs:{
        ram:Number,
        Storage:Number,
    },
    createdBy: ObjectId
    
})

const Laptop = model("laptop",laptop);

module.exports = Laptop;