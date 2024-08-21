import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";

const SuggestedUsers = () => {
  const { suggestedUsers } = useSelector((store) => store.auth);

  return (
    <div>
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-sm font-semibold text-gray-500">Suggested for you</h2>
        <span className="text-xs font-semibold text-gray-900 cursor-pointer">See All</span>
      </div>
      <div className="space-y-3">
        {suggestedUsers.map((user) => (
          <div key={user._id} className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
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
      </Link>
              <div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{user.username}</h3>
                <span className="text-xs text-gray-500">{user.bio || "Bio ... here"}</span>
              </div>
            </div>
            <button className="text-xs font-semibold text-blue-500 hover:text-blue-700">
              Follow
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SuggestedUsers;