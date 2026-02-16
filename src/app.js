const express = require('express');
const path = require('path');
const {connectDB} =require('./config/database')
const app = express ()
const {authRouter}=require('./routes/auth');
const {profileRouter}= require('./routes/profile')
const cookieParser = require('cookie-parser');
const cors = require('cors');
const { shopRouter } = require('./routes/shop');
const  itemRouter  = require('./routes/item');
const { cloudinaryRouter } = require('./routes/cloudinary');

// Trust proxy so secure cookies work correctly behind Render/other proxies
app.set('trust proxy', 1);

// Allow multiple frontend origins to access this API
const allowedOrigins = [
    "https://ecommerece-2aarq41m6-kedarsais-projects.vercel.app",
    "https://ecommerece-1f6b285c4-kedarsais-projects.vercel.app",
    "https://ecommerece-p1rw644l2-kedarsais-projects.vercel.app"
];

const corsOptions = {
    origin: function (origin, callback) {
        // Allow non-browser clients (no origin) and whitelisted origins
        if (!origin || allowedOrigins.includes(origin)) {
            return callback(null, true);
        }
        return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
};

app.use(express.json()); 
app.use(cookieParser())
app.use(cors(corsOptions))
// Serve static files from the public directory
app.use('/images', express.static(path.join(__dirname, '../public/images')));
app.use('/',authRouter)
app.use('/',profileRouter)
app.use('/',shopRouter)
app.use('/',itemRouter)
app.use('/api/cloudinary', cloudinaryRouter)
connectDB().then(()=>{
    console.log("Database connection Established...");
    app.listen(4545,()=>{
        console.log('server is successfully listening on port 4545 ')
    });

}).catch(err=>{
    console.error("database cannot be connected")
    console.log(err.message);
})

