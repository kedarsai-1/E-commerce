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
shopRouter.get('/sellershops/view',userAuth,async(req,res)=>{
    try{
        const userId = req.user._id;
        const shops = await Shop.find({owner:userId})
        res.json(shops)
    }
    catch(err){
        res.status(500).json({ error: err.message });

    }
})
const mongoose = require("mongoose");

shopRouter.patch('/sellershops/patch/:shopId', userAuth, async (req, res) => {
    try {

        const { shopId } = req.params;
        const userId = req.user._id;
        const updates = req.body;

        const shop = await Shop.findOneAndUpdate(
            { _id: shopId, owner: userId },
            { $set: updates },
            { new: true, runValidators: true }
        );

        if (!shop) {
            console.log(" Shop not found");
            return res.status(404).json({ error: "Shop not found or not owned by you" });
        }
        return res.json(shop); 
    } catch (err) {
        console.error(" Error updating shop:", err.message);
        return res.status(500).json({ error: err.message });
    }
});

module.exports = {shopRouter};