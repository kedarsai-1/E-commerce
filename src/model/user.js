const mongoose = require('mongoose');
const validator = require ('validator');
const userSchema = new mongoose.Schema({
    FirstName:{
        type:String,
        required:true,
        maxLength:20,
        trim:true
    },
    LastName:{
        type:String,
        required:true,
        maxLength:50,
        trim:true
    },
    emailId:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Invalid email')
            }
        }
    },
    Password:{
        type:String,
        required:true,
        trim:true,
        validate(value){
            if(!validator.isStrongPassword(value)){
                throw new Error("Please Enter a Strong Password");
            }
        }
    },
    isShopOwner:{
        type:Boolean,
        required:true,
    },
    phoneNumber:{
        type:String,
        trim:true,
        maxLength:10
      
    },
    photoUrl:{
        type:String,
        default:"https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png",
        validate(value){
            if(!validator.isURL(value)){
                throw new Error("Invalid photo URL");
            }
        }
    },
    Address:{
        type:[String],
        maxLength:50
    },
   
    
},
{
 timestamps:true   
})
userSchema.index({FirstName:1,LastName:1})
module.exports = mongoose.model("User",userSchema)
