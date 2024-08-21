import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Link } from 'react-router-dom';
const Comment = ({ comment }) => {
  return (
    <div className="flex items-start space-x-4 py-2">
      <Link to={`/profile/${ comment.author._id}`} className="flex items-center space-x-3 mb-4">
      <Avatar className="w-14 h-14 md:w-14 md:h-14 rounded-full overflow-hidden">
            <AvatarImage
             src={comment.author.profilePicture}
              className="w-full h-full object-cover"
            />
            <AvatarFallback className="bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200 flex items-center justify-center">
            {comment.author.username.slice(0, 2).toUpperCase()}
            </AvatarFallback>
            </Avatar>
      </Link>
      <div>
        <h1 className="text-sm font-semibold text-gray-800 dark:text-white">
          {comment.author.username}
          <span className="ml-2 text-sm font-normal text-gray-600 dark:text-gray-400">{comment.text}</span>
        </h1>
      </div>
    </div>
  );
};

export default Comment;
