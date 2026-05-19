import usermodel from "../models/user.model.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import generatedAccessToken from "../utils/token.js";
import Razorpay from "razorpay";
import transactionModel from "../models/transactionModel.js";
import crypto from "crypto";

//register
export async function registerUser(req, res) {
    try {
        
        const { name, email, password } = req.body;
      
        console.log("name",name);


        if (!name || !email || !password) {
            return res.json({
                succesms: false,
                error: true,
                message: "give full Details"
            })
        }

        const salt = await bcrypt.genSalt(10)
        const hashpassword = await bcrypt.hash(password, salt)

        const userData = {
            name,
            email,
            password: hashpassword
        }

        const user = new usermodel(userData);
        const save = await user.save()


        const token = jwt.sign({ id: user._id }, process.env.Jwt_SECRET)

        return res.json({
            message:"Registed successfully",
            name: name,
            token,
            error: false,
            success: true
        })
    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: error.message
        })
    }
}



//login
export async function login(req, res){
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.json({
                success: false,
                error: true,
                message: "give full Details"
            })
        }

        const user = await usermodel.findOne({ email })
        console.log(user);
       if(!user){
        return res.json({
            success:false,
            error:true,
            message:"user does not exist"
        })
       }

        const salt = await bcrypt.genSalt(10)
        const checkpassword = await bcrypt.compare(password, user.password)

        if (!checkpassword) {
            return res.json({
                message: "provide right password",
                success: false,
                error: true
            })
        }
    
        
    
    const accesstoken = await generatedAccessToken(user._id);
        
    const cookiesOption ={
        httpOnly:true,
        secure:true,
        sameSite:"None"
    }
    
    res.cookie("accessToken",accesstoken,cookiesOption);
    
        return res.json({
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                creditBalance: user.creditBalance,
                avatar: user.avatar || "",
              },
            message: "login successfully",
            token:accesstoken,
            error: false,
            success: true
        })
    }catch (error){
        res.json({
            error:true,
            success: false,
            message: error.message
        })
    }
}


//creadit 
export async function userCredits (req,res){
    try{
       const userid = req.userId
      
       if(!userid){
         return  res.json({
          message: "you must have a login",
          success:false,
          error:true,
        })
        }

       const user = await usermodel.findById(userid)

       res.json({
        success:true,
        credits:user.creditBalance,
        name:user.name
       })
    }catch(error){
       res.json({
            success: false,
            error:true,
            message: error.message
        })
    }
}


//userDeatails
export async function userDeatails(req,res){
    try{
    const userid = req.userId
    const user = await usermodel.findById(userid).select("-password");

    if(!user){
       return res.send({
         message:"user not found",
         error:true,
         success:false
    })
    }
  
    if(user){
        return res.json({
            data:user,
            error:false,
            success:true
        })
    }
    }catch(error){
    return res.json({
        message:error.message,
        error:true,
        success:false
    })
    }
}

//logout
export async function logout(req,res){
  try{
        const userid =  req.userId //middleware
        console.log("userid",userid);
        console.log("userid",userid);

        const cookiesOption = {
            httpOnly:true,
            secure:true,
            sameSite:"None"
        }

       res.clearCookie("accessToken",cookiesOption);
      

    

       return res.json({
        message:"Logout successfully",
        error:false,
        success:true,
       });

    }catch(error){
        return res.json({
            message:error.message||error,
            error:true,
            success:false
        })
    }
}

//razorpay
export const razorpayInstance = new Razorpay({
    key_id:process.env.RAZORPAY_Key_ID,
    key_secret:process.env.RAZORPAY_Key_SECRET
})




//  Create Razorpay Order (Step 1)
export async function paymentRazorpay(req, res) {
    try {
        console.log("mayank")
      const userId = req.userId;
      console.log("mayankuserId",userId)
      const { planId } = req.body;
  
      if (!userId || !planId) {
        return res.json({ success: false, message: "Missing details" });
      }
  
      let credits, plan, amount;
  
      switch (planId) {
        case "Basic":
          plan = "Basic";
          credits = 100;
          amount = 1000;
          break;
  
        case "Advanced":
          plan = "Advanced";
          credits = 500;
          amount = 5000;
          break;
  
        case "Business":
          plan = "Business";
          credits = 5000;
          amount = 25000;
          break;
  
        default:
          return res.json({ success: false, message: "Plan not found" });
      }
  
      // Create transaction in DB
      const newTransaction = await transactionModel.create({
        userId,
        plan,
        credits,
        amount,
        date: Date.now(),
      });
  
      // Create Razorpay Order
      const options = {
        amount: amount*100,
        currency: "INR",
        receipt: newTransaction._id.toString(),
      };
      
      
      let order;
      try {
        order = await razorpayInstance.orders.create(options);
        console.log("Razorpay order created:", order);
      } catch (err){
        console.log("Razorpay order creation failed:", err);
        return res.json({ success: false, message: err.message });
      }
      
      return res.json({
        success: true,
        order,
        key: process.env.RAZORPAY_Key_ID,
        amount,
        credits,
      });
  
    } catch (error) {
      res.json({ success: false, message: error.message });
    }
  }
                  
  // Verify Razorpay Payment (Step 2)
  export async function verifyRazorpay(req, res) {
   console.log("verify called1")
    try {
         console.log("verify called1.0")
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
        req.body;
   console.log("verify called1.1")
      const sign = razorpay_order_id + "|" + razorpay_payment_id;
      const expectedSign = crypto
        .createHmac("sha256", process.env.RAZORPAY_Key_SECRET)
        .update(sign)
        .digest("hex");
  console.log("verify called1.2")
      if (expectedSign !== razorpay_signature) {
        return res.json({ success: false, message: "Payment verification failed" });
      }
 console.log("verify called2")

  
      // Update transaction status
      await transactionModel.findByIdAndUpdate(req.body.receipt, {
        status: "success",
        paymentId: razorpay_payment_id,
      });

      console.log("verify called3")


      // Add credits to user
      const credits = req.body.credits;
      console.log("creditbackend",credits);
      const oldcredits = await usermodel.findById(req.userId).select("creditBalance");
      console.log("oldcredits",oldcredits);
     const data = await usermodel.findByIdAndUpdate(req.userId, 
       { creditBalance :  credits + oldcredits.creditBalance },
       { new: true }
      );
      console.log("backenddata",data);
   console.log("verify called4")

      return res.json({ success: true, data:data, message: "Payment verified" });
  
    } catch (error) {
      return res.json({ success: false, message: error.message });
    }
  }  

