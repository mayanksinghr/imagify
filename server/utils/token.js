import jwt from "jsonwebtoken"

const generatedAccessToken = async(userId)=>{
  const token = await jwt.sign({id:userId},
 process.env.Jwt_SECRET,
 {expiresIn:"1d"}
)
return token
}

export default generatedAccessToken;