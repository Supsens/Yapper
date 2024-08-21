import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { useSelector } from "react-redux";
import { useGetAllMessage } from "@/hooks/useGetAllMessage";
import { useGetRTM } from "@/hooks/useGetRTM";

const Messages = ({ selectedUser }) => {
  useGetRTM();
  useGetAllMessage();
  const { messages } = useSelector((store) => store.chat);
  const { user } = useSelector((store) => store.auth);

  return (
    <div className="flex flex-col h-full dark:bg-gray-900">
      <div className="flex items-center space-x-4 border-b border-gray-300 pb-4 mb-4 dark:border-gray-700">
        <Avatar className="w-14 h-14 md:w-14 md:h-14 rounded-full overflow-hidden">
          <AvatarImage
            src={selectedUser?.profilePicture}
            className="w-full h-full object-cover"
          />
          <AvatarFallback className="bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200 flex items-center justify-center">
            {selectedUser?.username.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <div>
          <span className="text-xl font-semibold dark:text-gray-100">
            {selectedUser?.username}
          </span>
          <Link to={`/profile/${selectedUser?._id}`}>
            <Button className="ml-4">View Profile</Button>
          </Link>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 p-4">
        {messages?.map((msg, index) => {
          const isSender = msg.senderId === user?._id;
          return (
            <div
              key={index}
              className={`flex ${isSender ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-xs p-3 rounded-lg shadow-sm ${
                  isSender
                    ? "bg-blue-500 text-white dark:bg-blue-600"
                    : "bg-gray-200 text-gray-800 dark:bg-gray-800 dark:text-gray-100"
                }`}
              >
                {msg.message}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Messages;
