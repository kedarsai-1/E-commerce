const mongoose = require('mongoose');
const connectDB= async ()=>{
    await mongoose.connect("mongodb+srv://kedar:Zero%401234@cluster0.pygiv.mongodb.net/e-commerce?retryWrites=true&w=majority")
}
module.exports = {connectDB};