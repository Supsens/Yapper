import { setsuggestedUser } from "@/redux/AuthSlice";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

export const useGetSuggestedUsers=()=>{
    const dispatch=useDispatch()
    useEffect(()=>{
        const fetchSuggestedUsers= async()=>{
            try {
                const res =await axios.get('http://localhost:8000/api/v1/user/suggested',{withCredentials:true});

                if(res.data.success)
                {
                    
                    dispatch(setsuggestedUser(res.data.users))
                }
            } catch (error) {
                console.log(error)
            }
        }
        fetchSuggestedUsers();
    },[]);
}

