import React from "react";
import { plans } from "../assets/assets";
import { assets } from "../assets/assets";
import axios from "axios";
import { useSelector } from "react-redux";
import { useContext } from "react";
import AppContext from "../context/AppContext";
import { useEffect } from "react";

const BuyCredit = () => {
  const user = useSelector((state) => state.user);
   console.log("buyuser",user);
   const {fetchuser} = useContext(AppContext);
 const localtoken = localStorage.getItem("accesstoken");
 console.log("localtoken",localtoken)

  const handlePurchase = async (planId) => {
    if (!user) return alert("Please login first");
    
    try {
      // Step 1 - Create Razorpay Order
      const res = await axios.post(
        "http://localhost:4000/api/user/pay-razorpay",
        { planId },
        {
          headers: {
            Authorization:`Bearer ${localStorage.getItem("accesstoken")}`,
          },
        }
      );
   
      if (!res.data.success) return alert("Order failed");

      const { key, order, amount, credits } = res.data;

      const options = {
        key,
        amount: order.amount,
        currency: "INR",
        name: "Your Website",
        description: `${planId} Plan`,
        order_id: order.id,

        handler: async function (response) {
          // Step 2 - Verify Payment
          await axios.post(
            "http://localhost:4000/api/user/verify-razorpay",
            {
              ...response,
              receipt: order.receipt,
              credits,
            },
            { headers: {
            Authorization:`Bearer ${localStorage.getItem("accesstoken")}`,
          },}
          );

            await  fetchuser();

          alert("Payment Successful! Credits added.");
        },

        prefill: {
          name: user.name,
          email: user.email,
        },

        theme: { color: "#000" },
      };

      const razor = new window.Razorpay(options);
      razor.open();
      
    

    } catch (error) {
      alert("Payment error");
      console.error(error);
    }
  };

  return (
    <div className="min-h-[80vh] text-center pt-14 mb-10">
      <button className="cursor-pointer border border-gray-400 px-10 py-2 rounded-full mb-6">
        Our plans
      </button>

      <h1 className="text-center text-3xl font-medium mb-6 sm:mb-10">
        Choose the plan
      </h1>

      <div className="flex flex-wrap justify-center gap-6 text-left cursor-pointer">
        {plans.map((item, index) => (
          <div
            key={index}
            className="bg-white drop-shadow-sm border rounded-lg py-12 px-8 text-gray-600 hover:scale-105 transition-all duration-500"
          >
            <img width={40} src={assets.logo_icon} alt="" />
            <p className="mt-3 mb-1 font-semibold">{item.id}</p>
            <p className="text-sm">{item.desc}</p>
            <p className="mt-6">
              <span className="text-3xl font-medium">${item.price} </span>/{" "}
              {item.credits} credits
            </p>

            <button
              onClick={() => handlePurchase(item.id)}
              className="w-full cursor-pointer bg-gray-800 text-white mt-8 text-sm rounded-md py-2.5 min-w-52"
            >
              {user ? "Purchase" : "Get Started"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BuyCredit;
