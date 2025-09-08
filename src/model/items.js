const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique:true
    },
    price:{
        type:Number,
        required:true
    },
    description:{
        type:String,
        required:true
    }
    ,
    shop:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Shop',
        required:true
    },
    image:{
        type:String,
        required:true
    }
},
{
    timestamps:true     
})

module.exports=mongoose.model("Item",itemSchema)