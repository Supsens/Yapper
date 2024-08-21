import { setMessages } from "@/redux/chatslice";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

export const useGetAllMessage=()=>{
    const dispatch=useDispatch()
    const {selectedUser}=useSelector(store=>store.auth)
    useEffect(()=>{
        const fetchAllMessage= async()=>{
            try {
                const res =await axios.get(`http://localhost:8000/api/v1/message/all/${selectedUser?._id}`,{withCredentials:true});

                if(res.data.success)
                {
                    // console.log(res.data.posts);
                    
                    dispatch(setMessages(res.data.messages))
                }
            } catch (error) {
                console.log(error)
            }
        }
        fetchAllMessage();
    },[selectedUser]);
}

