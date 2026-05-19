import mongoose from "mongoose"

const userSchema  = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    creditBalance:{
        type:Number,
        default:5
    }
  },{ collection: "user" })

const usermodel = mongoose.model("user",userSchema)

export default usermodel;

