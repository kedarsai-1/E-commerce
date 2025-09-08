
const mongoose = require('mongoose');
const shopSchema = new mongoose.Schema({
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true},
    name:{
        type:String,
        required:true
    },
    bannerUrl:{
        type:String,
        default:"https://www.indiafilings.com/learn/wp-content/uploads/2023/03/How-can-I-register-my-shop-and-establishment-online.jpg"
    },
    category:{ 
        type: String ,
        required:true

    },
    Address:{
        type:[String],
        required:true

    }






})
{
    timestamps:true
}
shopSchema.index({owner:1})
module.exports=mongoose.model("Shop",shopSchema)
