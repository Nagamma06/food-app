const mongoose = require('mongoose')

//schema
const userSchema = new mongoose.Schema({
    userName:{
        type:String,
        required:[true,'user name is required']
    },
    email:{
        type:String,
        required:[true,'email is required'],
        unique:true
    },
    password:{
        type:String,
        required:[true,'password is required']
    },
    address:{
        type:Array,
    },
    phone:{
        type:String,
        required:[true,'Phone number is required']
    },
    userType:{
        type:String,
        required:[true,'user type is required'],
        default:'client',
        enum:['client','admin','vendor','driver']
    },
    profile:{
        type:String,
        default:'https://i.pinimg.com/736x/0d/64/98/0d64989794b1a4c9d89bff571d3d5842.jpg'
    }

},{timestamps:true})

module.exports = mongoose.model('User',userSchema)