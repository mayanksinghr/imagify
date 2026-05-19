import React, { useContext, useEffect } from "react"
import { assets } from "../assets/assets"
import { useState } from "react"
import AppContext from "../context/AppContext"
import Axios from "../utils/Axios"
import SummaryApi from "../common/summaryApi"
import { IoMdUnlock } from "react-icons/io";
import { IoEyeOffOutline } from "react-icons/io5";
import { IoEyeOutline } from "react-icons/io5"
import { CiUser } from "react-icons/ci";
import { RiUser3Line } from "react-icons/ri";
import fetchUserDetails from "../utils/fetchuserdetail"
import { useDispatch } from "react-redux"
import { setUserDetails } from "../store/UserSlice"
import { useSelector } from "react-redux"
import toast from "react-hot-toast"



   const Login =({close})=>{

   const [state,setState] = useState("Login")
   const {setShowLogin} = useContext(AppContext)
   const [showpassword,setshowpassword] = useState(true);
   const dispatch = useDispatch();
   const user = useSelector((state)=>state.user);

   console.log("user login",user);


   const [data ,setdata] = useState({
    name:"",
    email:"",
    password:""
   })


   useEffect(()=>{
    document.body.style.overflow ="hidden";

    return ()=>{
        document.body.style.overflow = "unset";
    }
   },[])


   const handleonchange =(e)=>{

     const {name,value} = e.target
      setdata((preve)=>{
        return{
        ...preve,
        [name]:value
        }
      })
   }

   const handleSubmit =async(e)=>{
     e.preventDefault() 

     console.log("handle sub")
    try{
        let response
     state=="Login"?(
          response = await Axios({
        ...SummaryApi.login,
        data:data
    })
     ):(
        response = await Axios({
        ...SummaryApi.register,
        data:data
    })
     )
  
    console.log(response)
      if(response.data.success){
       toast.success(response.data.message);
       console.log("response.data.token",response.data.token);
       dispatch(
        setUserDetails({
          ...response.data.user,       // if you have user object
          token: response.data.token,   //  ADD THIS
        })
      );
        localStorage.setItem("accesstoken",response.data.token); 
       const user = await fetchUserDetails();
       console.log("user response",user.data.data);
        dispatch(setUserDetails(user.data.data))
        
        close()
      }
           if(response.data.error){
            toast.error(response.data.message)
        }

    }catch(error){
        console.log(error);
        
    }
   }


    return(
     <div className=" fixed top-0 left-0 right-0 bottom-0 z-10 backdrop-blur-sm bg-black/30 flex justify-center items-center overflow-hidden">
      <form onSubmit={handleSubmit} className="relative bg-white p-10 rounded-xl text-slate-500">
        <h1 className="text-center text-2xl text-neutral-700 font-medium">{state}</h1>
        <p className="text-sm">{`Welcome back please ${state}  to continue`}</p>

        {state !=="Login" &&
        <div className="border px-6 py-2 flex items-center gap-2 rounded-full mt-5">
             <RiUser3Line className="text-gray-400"/>
            <input  onChange={handleonchange} name="name"  value={data.name} className="outline-none text-sm" type="text" placeholder="Full Name"/>
        </div>
     }
       
        <div className="border px-6 py-2 flex items-center gap-2 rounded-full mt-4">
            <img src={assets.email_icon} alt=""/>
            <input  onChange={handleonchange}  className="outline-none text-sm" name="email" value={data.email}  type="email" placeholder="Email id"/>
        </div>

     
        <div className="border px-6 py-2 flex items-center gap-2 rounded-full mt-4">
            {showpassword?(
            <IoEyeOffOutline onClick={() => setshowpassword(prev => !prev)} className="  cursor-pointer text-gray-400 "/>
            ):(
            <IoEyeOutline onClick={() => setshowpassword(prev => !prev)} className="  cursor-pointer text-gray-400"/>
            )
            }

            <input type = {showpassword?("password"):("text")}
              onChange={handleonchange}   className="outline-none text-sm"  name="password" value={data.password}  placeholder="Password"/>
        </div> 

        <p className="text-sm text-blue-600 my-4 cursor-pointer">Forgot password</p>
        <button  className="bg-blue-600 w-full text-white py-2 rounded-full cursor-pointer">{state==="Login"?"login":"create account"}</button>
        {state ==="Login" ?
        <p  onClick={()=>setState("Sign Up")}   className="mt-5 text-center">Don't have an account?<span className="text-blue-600 cursor-pointer">Sign up</span></p>
         :
       <p onClick={()=>setState("Login")}  className="mt-5 text-center">Already have an accout?<span className="text-blue-600 cursor-pointer">Login</span>

       
      </p>
      }
        <img onClick={()=>setShowLogin(false)}  src={assets.cross_icon} about="alt" className="absolute top-5 right-5 cursor-pointer"/>
      

      </form>

     </div>
    )
}

export default Login