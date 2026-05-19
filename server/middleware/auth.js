import jwt from "jsonwebtoken"

const auth =async(req,res,next)=>{
    try{
        const token = req.cookies.accessToken||req?.headers?.authorization?.split(" ")[1]////["baerer","token"]
        console.log("token",token);

        if(!token){
            return res.json({
                message:"provide token",
                error:true,
                success:false,
            })
         }
           
    const decode = await jwt.verify(token,process.env.Jwt_SECRET)

    if(!decode){
        return res.json({
            message:"unauthorized access",
            error:true,
            success:false,
        })
    }

   req.userId = decode.id

   next();
    

    
    console.log("decode",decode);

    }catch(error){
      return res.json({
        message:error.message||error,
        error:true,
        success:false
      })
    }

}

export default auth