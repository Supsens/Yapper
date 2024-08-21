import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Avatar, AvatarFallback } from "@radix-ui/react-avatar";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { setAuthUser } from "@/redux/AuthSlice";
import axios from "axios";

const EditProfile = () => {
  const imageRef = useRef();
  const { user } = useSelector((store) => store.auth);
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState({
    profilePicture: user?.profilePicture,
    bio: user?.bio,
    gender: user?.gender,
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const fileChangeHandler = (e) => {
    const file = e.target.files?.[0];
    if (file) setInput({ ...input, profilePicture: file });
  };

  const selectChangeHandler = (value) => {
    setInput({ ...input, gender: value });
  };

  const editProfileHandler = async () => {
    const formData=new FormData();
    formData.append("bio",input.bio)
    formData.append("gender",input.gender)

    if(input.profilePicture)
    {
        formData.append("profilePicture",input.profilePicture)

    }
    try {

      setLoading(true);
      const res=await axios.post('http://localhost:8000/api/v1/user/profile/edit',formData,{
        Headers:{
            'Content-Type':'multipart/form-data'
        },
        withCredentials:true
      })

      if(res.data.success)
      {
        const updatedUserData={
            ...user,
            bio:res.data.user?.bio,
            profilePicture:res.data.user?.profilePicture,
            gender:res.data.user?.gender
        }
        dispatch(setAuthUser(updatedUserData))
        navigate(`/profile/${user?._id}`);
        toast.success(res.data.message);
      }
      
    } catch (error) {
      console.log(error);
      toast.error(res.data.message);
    }finally{
        setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-8 bg-white dark:bg-gray-900 rounded-lg shadow-lg">
      <section>
        <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Edit Profile
        </h1>
        <div className="flex items-center justify-between bg-gray-100 dark:bg-gray-800 p-4 rounded-lg mb-4">
          <div className="flex items-center">
            <Avatar className="w-12 h-12 rounded-full mr-4">
              <img
                src={user?.profilePicture}
                alt="Profile"
                className="object-cover w-full h-full rounded-full"
              />

            </Avatar>
            <div>
              <h1 className="text-md font-semibold text-gray-900 dark:text-white">
                {user?.username || "Username"}
              </h1>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {user?.bio || "Bio ... here"}
              </span>
            </div>
          </div>
          <Button
            className="bg-blue-500 text-white hover:bg-blue-600"
            onClick={() => imageRef?.current.click()}
          >
            Change photo
          </Button>
        </div>
        <input
          ref={imageRef}
          onChange={fileChangeHandler}
          type="file"
          className="hidden"
        />
        <div className="mb-4">
          <h1 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
            Bio
          </h1>
          <Textarea
            className="w-full bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white p-2 rounded-lg"
            value={input.bio}
            onChange={(e) => setInput({ ...input, bio: e.target.value })}
          />
        </div>
        <div className="mb-4">
          <h1 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
            Gender
          </h1>
          <Select
            defaultValue={input.gender}
            onValueChange={selectChangeHandler}
          >
            <SelectTrigger className="w-full bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white p-2 rounded-lg">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">male</SelectItem>
              <SelectItem value="female">female</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="text-center">
          {loading ? (
            <Button className="w-full bg-blue-600 text-white py-2 rounded-lg flex items-center justify-center">
              <Loader2 className="mr-2 animate-spin" />
              Please Wait
            </Button>
          ) : (
            <Button
              className="w-full bg-blue-600 text-white py-2 rounded-lg"
              onClick={editProfileHandler}
            >
              Submit
            </Button>
          )}
        </div>
      </section>
    </div>
  );
};

export default EditProfile;
