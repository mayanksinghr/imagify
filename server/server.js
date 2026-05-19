import express from "express"
import cors from "cors"
import "dotenv/config"
import connectDB from "./config/connectDB.js"
import Userrouter from "./routes/userRouter.js"
import cookieParser from "cookie-parser"
import morgan from "morgan"
import helmet from "helmet"
import router from "./routes/Routes.js"


const PORT = process.env.PORT || 4000
const app = express()

app.use(cors({
    origin:  ["http://localhost:5173", "http://localhost:5174"],
  credentials: true
}))

app.use(express.json())
app.use(cookieParser())
app.use(morgan())
app.use(helmet({
    crossOriginEmbedderPolicy:false
}))



app.get('/',(req,res)=>{
  res.send("API Working fine");
})

app.use("/api/user",Userrouter);
app.use("/api",router);



connectDB().then(()=>
    app.listen(PORT,()=>{
    console.log("app is listen at port 4000")
}))

