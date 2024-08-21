import React, { useState } from "react";
import {
  Heart,
  Home,
  MessageCircle,
  PlusSquare,
  Search,
  TrendingUp,
  LogOut,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setAuthUser } from "@/redux/AuthSlice";
import CreatePost from "./CreatePost";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";

const LeftSideBar = () => {
  const [open, setOpen] = useState(false);
  const { user } = useSelector((store) => store.auth);
  const { likeNotification } = useSelector(
    (store) => store.realTimeNotification
  );
  console.log(likeNotification);

  const SideBarItems = [
    {
      icon: <Home />,
      text: "Home",
    },
    {
      icon: <Search />,
      text: "Search",
    },
    {
      icon: <TrendingUp />,
      text: "Explore",
    },
    {
      icon: <MessageCircle />,
      text: "Messages",
    },
    {
      icon: <Heart />,
      text: "Notification",
    },
    {
      icon: <PlusSquare />,
      text: "Create",
    },
    {
      icon: (
        <Avatar>
          <AvatarImage src={user?.profilePicture} />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      ),
      text: "Profile",
    },
    {
      icon: <LogOut />,
      text: "Logout",
    },
  ];

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const logoutHandler = async () => {
    try {
      const res = await axios.get("https://yapper-8ny9.onrender.com/api/v1/user/logout", {
        withCredentials: true,
      });
      if (res.data.success) {
        dispatch(setAuthUser(null));
        toast.success("Logged out successfully");
        navigate("/login");
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const sidehandler = (textType) => {
    if (textType === "Logout") {
      logoutHandler();
    } else if (textType === "Create") {
      setOpen((prev) => !prev);
    } else if (textType === "Profile") {
      navigate(`/profile/${user?._id}`);
    } else if (textType === "Home") {
      navigate("/");
    } else if (textType === "Messages") {
      navigate("/chat");
    }
  };

  return (
    <div className="w-64 h-screen bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white flex flex-col items-start p-4 space-y-6">
      {SideBarItems.map((item, index) => (
        <div
          key={index}
          onClick={() => sidehandler(item.text)}
          className="flex items-center space-x-3 hover:bg-gray-200 dark:hover:bg-gray-700 p-2 rounded-lg w-full cursor-pointer"
        >
          <div className="text-2xl">{item.icon}</div>
          <div className="text-lg">{item.text}</div>

          {item.text === "Notification" && likeNotification?.length > 0 && (
            <Popover>
              <PopoverTrigger>
                <Button variant="ghost" className="relative">
                  <Heart className="text-red-500" />
                  <span className="absolute top-0 right-0 text-xs bg-red-500 text-white rounded-full h-5 w-5 flex items-center justify-center">
                    {likeNotification.length}
                  </span>
                </Button>
              </PopoverTrigger>
              <PopoverContent>
                <div className="p-4">
                  {likeNotification.length === 0 ? (
                    <p className="text-gray-600">No new notifications</p>
                  ) : (
                    likeNotification.map((notification) => (
                      <div
                        key={notification.userId}
                        className="flex items-center space-x-3 mb-2"
                      >
                        <Avatar>
                          <AvatarImage
                            src={notification.userDetails?.profilePicture}
                          />
                          <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                        <div className="text-sm">
                          <p className="font-medium">
                            {notification.userDetails?.username}
                          </p>
                          <p className="text-gray-600">Liked your post</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </PopoverContent>
            </Popover>
          )}
        </div>
      ))}
      <CreatePost open={open} setopen={setOpen} />
    </div>
  );
};

export default LeftSideBar;
