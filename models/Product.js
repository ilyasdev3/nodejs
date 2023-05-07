const mongoose = require("mongoose")


const Productchema = new mongoose.Schema({
    title:{
        type:String,
    },
    price:{
        type:Number,
    },
    productDesc: {
        type: String,
    }
})


const Product = mongoose.model( "Product",Productchema)

module.exports = Product