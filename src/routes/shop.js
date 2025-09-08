const express =require('express');
const shopRouter = express.Router();
const Shop =require('../model/shop');
const { userAuth } = require('../middleware/auth');
const user = require('../model/user');
shopRouter.post('/shops',userAuth,async(req,res)=>{
    try{
        const userId = req.user._id;
        const isShopOwner = req.user.isShopOwner;
        if(isShopOwner === false){
         return  res.status(400).send("You are not Shop Owner")
        }
        const { name, bannerUrl, category, Address } = req.body;

        const shop = new Shop(
            {
                owner:userId,
                name,
                bannerUrl,
                category,
                Address
            }

        )
        await shop.save();
        res.json({message:"Registration completed",data:shop})


    }
    catch(err){
        res.send(err.message)

    }


})
shopRouter.get('/shops/view',async(req,res)=>{
    try{
        const shops = await Shop.find()
        res.json(shops)
    }
    catch(err){
        res.status(500).json({ error: err.message });
    }


})
module.exports = {shopRouter};