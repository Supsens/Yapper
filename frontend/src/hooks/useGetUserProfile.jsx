import { setuserProfile } from "@/redux/AuthSlice";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

export const useGetUserProfile = (userId) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/api/v1/user/${userId}/profile`, { withCredentials: true });

        if (res.data.success) {
          dispatch(setuserProfile(res.data.user));
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchUserProfile();
  }, [userId, dispatch]);  // Ensure `userId` and `dispatch` are included in the dependency array
};
