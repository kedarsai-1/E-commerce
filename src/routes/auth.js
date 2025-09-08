const express = require('express');
const authRouter = express.Router();
const User = require('../model/user')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const validator = require("validator")
const {userAuth} = require('../middleware/auth')
const {validateSignupdata}= require('../validate/validation')


authRouter.post('/signup',async(req,res)=>{
    try{
         validateSignupdata(req);

        const {FirstName,LastName,emailId,Password,isShopOwner}=req.body;
        const PasswordHash = await bcrypt.hash(Password,10);

        const user =new User({
            FirstName,
            LastName,
            emailId,
            Password:PasswordHash,
            isShopOwner

        })
       const savedUser= await user.save();
       const token = jwt.sign({_id:user._id},"DEV@Tinder$790",{expiresIn:"1d"})
       res.cookie('token',token,{httpOnly:true})
       res.send(savedUser);

    }
    catch(err){
        res.status(400).send(err.message);
    }

})
authRouter.post('/login', async (req, res) => {
    try {
      const { emailId, Password } = req.body;
  
      if (!validator.isEmail(emailId)) {
        throw new Error("Enter valid Email Id");
      }
  
      const user = await User.findOne({ emailId: emailId });
      if (!user) {
        throw new Error("Invalid Credentials");
      }
  
      const isPasswordValid = await bcrypt.compare(Password, user.Password);
      if (isPasswordValid) {
        const token = jwt.sign({ _id: user._id }, "DEV@Tinder$790", { expiresIn: "1d" });
  
    
        res.cookie("token", token, {
          httpOnly: true, 
          path: "/"
        });
  
        res.send(user);
      } else {
        res.status(400).send("Invalid Credentials");
      }
    } catch (err) {
      res.status(400).send("Error: " + err.message);
    }
  });
  
  authRouter.post('/logout', (req, res) => {
   
    res.clearCookie("token", {
      httpOnly: true,
     
      
    
    });
  
    res.send("Successfully logged out");
  });
  
  
module.exports={authRouter}