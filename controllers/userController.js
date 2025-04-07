const userModel = require("../models/userModel")
const bcrypt = require('bcryptjs');
const JWT = require('jsonwebtoken');

const userController = async(req,res) =>{
    try{
        const user = await userModel.findById({_id:req.body.id})
        if(!user){
            return res.status(404).send({
                success:false,
                message:'User not found'
            })
        }
        //hide password
        user.password = undefined
        //send user data to client
        res.status(200).send({
            success:true,
            message:"User get success",
            user
        })
        res.status(200).send({
            success:true,
            user
        })
    }catch(err){
        res.status(500).send({
            success:false,
            message:'Error in User Data API',
            error:err.message
        })
    }
    //res.status(200).send("User Data")
}


const updateUserController = async(req,res) =>{
    try{
          // console.log(req.body)
        const user = await userModel.findById({_id:req.body.id})
        if(!user){
            return res.status(404).send({
                success:false,
                message:'User not found'
            })
        }
        const {userName,address,phone}= req.body
       // console.log(userName, address, phone)
         if(userName)
            user.userName = userName
        if(address)
            user.address = address
        if(phone)
            user.phone = phone
        //save user
        await user.save()
        //hide password
        user.password = undefined
        //send user data to client
        res.status(200).send({
            success:true,
            message:"User updated successfully",
            user
        })

    }catch(err){
    res.status(500).send({
        success:false,
        message:'Error in User Update API',
        error:err.message
    })
}
}

const passwordUpdateController = async(req,res) =>{
    try{
        const user = await userModel.findById({_id:req.body.id})
        if(!user){
            return res.status(404).send({
                success:false,
                message:'User not found'
            })
        }
        const {oldPassword,newPassword}= req.body
        //validate passwords
        if(!oldPassword || !newPassword){
            return res.status(500).send({
                success:false,
                message:'Please enter Old password or new password '
            })
        }

        //validate old password
        const isMatch = await bcrypt.compare(oldPassword, user.password)
        if(!isMatch){
            return res.status(500).send({
                success:false,
                message:'Old password is incorrect'
            })
        }
        //hash new password
        var salt = bcrypt.genSaltSync(10)
        const hashedPassword = await bcrypt.hash(newPassword, salt)
        //update password
        user.password = hashedPassword
        //save user
        await user.save()
        //send success message
        res.status(200).send({
            success:true,
            message:"Password updated successfully"
        })

    }catch(err){
        res.status(500).send({
            success:false,
            message:'Error in Password Update API',
            error:err.message
        })
    }

}

const sendResetPasswordLink= async(req,res) =>{
    try{
        const {email} = req.body
        const user = await userModel.findOne({email})
        if(!user){
            return res.status(404).send({
                success:false,
                message:'User not found'
            })
        }
        //generate reset token
        const token = JWT.sign({id:user._id,email:user.email},
                               process.env.JWT_SECRET,
                               {"expiresIn":"10m"
        })
        //send email with reset link
        const link = `${process.env.WEBSITE_LINK}/resetPassword?token=${token}`
        console.log(link)
        user.resetTokenUsed = false;
        await user.save();
        res.status(200).send({
            success:true,
            message:'Reset Password link sent successfully',
            link:link
        })
    }catch(err){
        res.status(500).send({
            success:false,
            message:'Error in Reset Password API',
            error:err.message
        })
    }

}

const resetUserPasswordController = async(req,res) => {
try{
    const token = req.query.token //getting value from query string
    const {newPassword} = req.body
    //console.log(token,".......", newPassword)
    const decode = JWT.decode(token)
    const user = await userModel.findOne({email:decode.email})
    //validate token expiry and valid user
    if(!decode || decode.exp < Date.now() / 1000 || !user){
        return res.status(401).send({
            success:false,
            message:'Token is invalid or expired'
        })
    }
    //check if token is already used
    if (user.resetTokenUsed) {
        return res.status(400).send({ success:false,message: 'Reset link already used' });
      }
    var salt = bcrypt.genSaltSync(10)
    const hashedPassword = await bcrypt.hash(newPassword, salt)
    //update password
    user.password = hashedPassword
    //mark token is already used 
    user.resetTokenUsed = true
    //save user
    await user.save()
    //send success message
    res.status(200).send({
        success:true,
        message:'Password reset successfully'
    })
    
}catch(err){
    res.status(500).send({
        success:false,
        message:'Error in Reset Password API',
        error:err.message
    })
}
}
module.exports = {userController, updateUserController, passwordUpdateController, sendResetPasswordLink,resetUserPasswordController}