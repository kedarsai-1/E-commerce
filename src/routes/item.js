const express = require('express');
const itemRouter = express.Router();
const Item = require('../model/items');
const { userAuth } = require('../middleware/auth');
const Shop = require('../model/shop');

itemRouter.post('/shops/:shopId/items',userAuth,async(req,res)=>{
    try{
        const userId = req.user._id;
        const shopId = req.params.shopId;
        const shop = await Shop.findOne({_id:shopId});
        if(!shop){
            return res.status(403).json({message:"you do not own this shop"});
        }  
        const { name, price, description, image } = req.body;
        const item = new Item({
            name,
            price,
            description,
            image,
            shop: shopId
        });
        const items = await Item.find({shop:shopId});
        if(req.body.name === items.name ){
            return res.json({message:"Item Already Existed"})
        }
        await item.save();
        res.json({message:" Item Registration completed",data:item})
    }
    catch(err){
        res.status(400).send(err.message);
    }
})
itemRouter.get('/shops/:shopId/items',userAuth,async(req,res)=>{
    try{
        const shopId = req.params.shopId;
        const items = await Item.find({shop:shopId});
       
        res.json({message:"Items fetched successfully",data:items})
    }
    catch(err){
        res.status(400).send(err.message);
    }
})

module.exports = itemRouter;
