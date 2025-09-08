const express = require('express');
const { userAuth } = require('../middleware/auth');
const profileRouter = express.Router();
const {validEditProfileData} = require('../validate/validation')
profileRouter.get("/profile/view",userAuth,async(req,res)=>{
    try{
        const user = req.user;
        if(!user){
            throw new Error("user not found");

        }
        res.send(user);
    }
    catch(err){
      
        res.status(400).send(err.message); 
    
   }
})
profileRouter.patch("/profile/edit",userAuth,async(req,res)=>{
    try{
        if(!validEditProfileData(req)){
            throw new Error("Invalid edit Request");
        }
        const loggedInUser = req.user;
         Object.keys(req.body).forEach((key)=> {
            loggedInUser[key]= req.body[key]
           
           
        })
       const data= await loggedInUser.save();
        console.log(loggedInUser)
        res.json({message:`${req.user.FirstName},your profile updated sucessfully`,data})



    }
    catch(err){
        res.status(400).send("ERROR" +err.message)

    }

})
module.exports= {profileRouter}