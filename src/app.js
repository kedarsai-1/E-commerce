const express = require('express');
const {connectDB} =require('./config/database')
const app = express ()
const {authRouter}=require('./routes/auth');
const {profileRouter}= require('./routes/profile')
const cookieParser = require('cookie-parser');
const cors = require('cors');
const { shopRouter } = require('./routes/shop');
const  itemRouter  = require('./routes/item');

app.use(express.json()); 
app.use(cookieParser())
app.use(cors({
    origin:"https://ecommerece-2aarq41m6-kedarsais-projects.vercel.app",
    credentials:true,
}))
app.use('/',authRouter)
app.use('/',profileRouter)
app.use('/',shopRouter)
app.use('/',itemRouter)
connectDB().then(()=>{
    console.log("Database connection Established...");
    app.listen(4545,()=>{
        console.log('server is successfully listening on port 4545 ')
    });

}).catch(err=>{
    console.error("database cannot be connected")
    console.log(err.message);
})

