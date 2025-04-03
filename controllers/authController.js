const userModel = require('../models/userModel')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')

const registerController = async(req,res) =>{
try{
    const {userName,email,password,phone,address} = req.body
    //validation
    if(!userName || !email || !password || !phone || !address){
        return res.status(500).send({
            success:false,
            message:'Please provide all fields'
        })
    }
   //check user
   const existing = await userModel.findOne({email})
   if(existing){
    return res.status(500).send({
        success:false,
        message:'Email Already Registered Please Login'
    })
   }

   //Hashing password
   var salt = bcrypt.genSaltSync(10)
   const hashedPassword = await bcrypt.hash(password, salt)
   
   //create new user
   const user = await userModel.create({userName,email,password:hashedPassword,address,phone})
   res.status(201).send({
    success:true,
    message:'successfully Registered',
    user
   })

}catch(error){
        console.log(error.message)
        res.status(500).send({
            success:false,
            message:'Error In Register API',
            error
        })
    }
}

const loginController = async(req,res)=>{
    try{

        const {email, password} = req.body
        //validation
        if(!email || !password){
            return res.status(500).send({
                success:false,
                message:'Please Provide all the fields'
            })
        }
        //Check USer
        const user = await userModel.findOne({email: email})
        if(!user){
             return res.status(404).send({
                success:false,
                message:'User Not Found'
            })
        }

        //Check user password || compare password
        const isMatch = await bcrypt.compare(password, user.password)
        if(!isMatch){
           return res.status(400).send({
                success:false,
                message:'Invalid Credentials'
            })
        }
        //Exclude password in response
        user.password = undefined
        //Generate JWT token
        const token = jwt.sign({id:user._id}, process.env.JWT_SECRET,{expiresIn:"7d"})
        res.status(200).send({
            success:true,
            message:'Login Successful',
            token,
            user
        })
    }catch(error){
        console.log(error.message)
        res.status(500).send({
            success:false,
            message:'Error In Login API',
            error
        })
    }

}

module.exports = { registerController, loginController}