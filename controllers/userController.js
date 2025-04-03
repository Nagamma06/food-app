const userModel = require("../models/userModel")

const userController = async(req,res) =>{
    try{
        const user = await userModel.findById(req.body.id)
        if(!user){
            return res.status(404).send({
                success:false,
                message:'User not found'
            })
        }
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

module.exports = {userController}