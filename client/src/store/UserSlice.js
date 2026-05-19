import {createSlice} from "@reduxjs/toolkit";

const initalValue = {
    _id:"",
    name:"",
    email:"",
    creditBalance:"",
    avatar:""
}

const userSlice = createSlice({
    name:"user",
    initialState:initalValue,
    reducers:{
        setUserDetails :(state,action)=>{
            state._id = action.payload?._id
            state.name = action.payload?.name
            state.email = action.payload?.email
            state.creditBalance = action.payload?.creditBalance;
            state.token = action.payload?.token;
            
        },
       
        logout:(state,action)=>{
             state._id = ""
            state.name = ""
            state.email = ""   
        },
          updatedAvatar:(state,action)=>{
            state.avatar = action.payload
        },
    }
}) 

export const {setUserDetails,logout} = userSlice.actions

export default userSlice.reducer