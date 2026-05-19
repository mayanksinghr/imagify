import React, { useState } from 'react'
import { Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
import AppContext from './context/AppContext';
import Footer from './components/Footer';
import Login from './components/login';
import fetchUserDetails from './utils/fetchuserdetail';
import { useDispatch } from 'react-redux';
import { setUserDetails } from './store/UserSlice';
import { useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';

const App = () => {

 
  const [user,setUser] = useState(null)
  const [showLogin,setShowLogin] = useState(false)
  const dispatch = useDispatch()

  const fetchuser=async()=>{

      const userdata = await fetchUserDetails()
      console.log("userdata",userdata)
      dispatch(setUserDetails(userdata.data.data))
  }

  useEffect(()=>{
    fetchuser();
    const token = localStorage.getItem("accesstoken");
    console.log("aaptoken",token)
    if (token) {
      dispatch(setUserDetails(
        {
        token 
        }
        ));
    }
  },[])

  

const value={
    user,setUser,showLogin,setShowLogin,fetchuser
  }

  return (
    <>
    <AppContext.Provider value ={value}>
      <div className='px-4 sm:px-10 md:px-14 lg:px-28 min-h-screen bg-gradient-to-b from-teal-50 to-orange-50'>
      <Navbar/>
     {showLogin && <Login  close={()=>setShowLogin(false)}/>}
      <Outlet/>
      <Footer/>
      <Toaster className="top-center"/>
   </div>
   </AppContext.Provider>
  </>
  )
}

export default App;
