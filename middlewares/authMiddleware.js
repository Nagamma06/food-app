const JWT = require('jsonwebtoken');

module.exports = async(req,res,next) => {

    try{
        //console.log(req.headers)
        const token = req.headers.authorization.split(' ')[1];
        JWT.verify(token, process.env.JWT_SECRET,(err,decode)=>{
            if(err){
                return res.status(401).send({
                    success:false,
                    message:'un-authorized user'
                })
            }else{
                //console.log("In middleware:",req.body)
                //req.body.id = decode.id
                req.body = {...req.body, id: decode.id};
               // console.log("After middleware:",req.body)
                next()
            }
        })

    }catch(error){
        console.log(error.message)
        return res.status(500).send({
            success:false,
            message:'Please provide auth Token',
            error
        })
    }
}