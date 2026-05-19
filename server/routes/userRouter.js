import { Router } from "express";
import auth from "../middleware/auth.js";
import { registerUser,login,userCredits, userDeatails, logout, paymentRazorpay, verifyRazorpay} from "../conntroller/userconnectroller.js";

const Userrouter = Router()

Userrouter.post("/register",registerUser)
Userrouter.post("/login",login)
Userrouter.post("/credit",auth,userCredits)
Userrouter.get("/userDetail",auth,userDeatails)
Userrouter.get("/logout",auth,logout)
Userrouter.post("/pay-razorpay",auth,paymentRazorpay)
Userrouter.post("/verify-razorpay", auth, verifyRazorpay);

export default Userrouter;


