import { createSlice } from "@reduxjs/toolkit";
const initialState={user:null
    ,
    suggestedUsers:[],
    userprofile:null,
    selectedUser:null
}
const authslice=createSlice({
    name:"auth",
    initialState,
    reducers:{
        setAuthUser:(state,action)=>{
            state.user=action.payload;
        }
        ,
        setsuggestedUser:(state,action)=>{
            state.suggestedUsers=action.payload;
        },
        setuserProfile:(state,action)=>{
            state.userprofile=action.payload;
        },
        setSelectedUser:(state,action)=>{
            state.selectedUser=action.payload;
        }
    }
})
export const {setAuthUser,setsuggestedUser,setuserProfile,setSelectedUser}=authslice.actions
export default authslice.reducer;