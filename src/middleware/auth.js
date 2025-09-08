const jwt = require("jsonwebtoken");
const User = require("../model/user");
const userAuth =async (req,res,next)=>{
// REad the token from the req cookies
try{
const {token} =req.cookies;
if(!token){
return res.status(401).send('You are not Logged In')
}
const decodedobj = await jwt.verify(token,"DEV@Tinder$790");
const {_id} =decodedobj;
const user = await User.findById({_id});
if(!user){
    throw new Error('User not Found');
}
req.user = user; 
next();
}
catch(err){
   throw new Error("ERROR"+err.message);
}

// validate the token
// Find the user
};
module.exports = {
    userAuth
}