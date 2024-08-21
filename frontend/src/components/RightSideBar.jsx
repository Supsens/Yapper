import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import SuggestedUsers from "./SuggestedUsers";

const RightSideBar = () => {
  const { user } = useSelector((store) => store.auth);

  return (
    <div className="w-full lg:w-1/4 p-4 bg-white dark:bg-gray-900">
      <Link to={`/profile/${user?._id}`} className="flex items-center space-x-3 mb-4">
      <Avatar className="w-14 h-14 md:w-14 md:h-14 rounded-full overflow-hidden">
            <AvatarImage
              src={user?.profilePicture}
              className="w-full h-full object-cover"
            />
            <AvatarFallback className="bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200 flex items-center justify-center">
              {user?.username.slice(0, 2).toUpperCase()}
            </AvatarFallback>
            </Avatar>
        <div>
          <h1 className="text-sm font-semibold text-gray-900 dark:text-white">
            {user?.username || "Username"}
          </h1>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {user?.bio || "Bio ... here"}
          </span>
        </div>
      </Link>
      <SuggestedUsers />
    </div>
  );
};

export default RightSideBar;