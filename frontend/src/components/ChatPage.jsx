import { setSelectedUser } from "@/redux/AuthSlice";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "./ui/button";
import { MessageCircle } from "lucide-react";
import Messages from "./Messages";
import axios from "axios";
import { setMessages } from "@/redux/chatslice";

const ChatPage = () => {
  const [textMessage, setTextMessage] = useState("");
  const { user, suggestedUsers, selectedUser } = useSelector(
    (store) => store.auth
  );
  const { onlineUsers } = useSelector((store) => store.chat);
  const { messages } = useSelector((store) => store.chat);
  const dispatch = useDispatch();

  const sendMessageHandler = async (receiverId) => {
    try {
      const res = await axios.post(
        `https://yapper-8ny9.onrender.com/api/v1/message/send/${receiverId}`,
        { message: textMessage }, // Use 'message' as the key
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
  
      if (res.data.success) {
        dispatch(setMessages([...messages, res.data.newmessage]));
        setTextMessage(""); // Clear the input field after sending the message
      }
    } catch (error) {
      console.log(error);
    }
  };
  
  useEffect(() => {
    return () => {
      dispatch(setSelectedUser(null));
    };
  }, []);

  return (
    <div className="flex h-screen dark:bg-gray-900">
      <section className="w-1/4 border-r border-gray-300 dark:border-gray-700 p-4 dark:bg-gray-800">
        <h1 className="text-xl font-bold mb-4 dark:text-gray-100">
          {user?.username}
        </h1>
        <hr className="mb-4 border-gray-300 dark:border-gray-700" />
        <div className="space-y-4">
          {suggestedUsers.map((suggestedUser) => {
            const isOnline = onlineUsers.includes(suggestedUser?._id);
            return (
              <div
                key={suggestedUser._id}
                className="flex items-center space-x-4 p-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => dispatch(setSelectedUser(suggestedUser))}
              >
                <Avatar className="w-14 h-14 md:w-14 md:h-14 rounded-full overflow-hidden">
                  <AvatarImage
                    src={suggestedUser?.profilePicture}
                    className="w-full h-full object-cover"
                  />
                  <AvatarFallback className="bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200 flex items-center justify-center">
                    {suggestedUser?.username.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <span className="block font-semibold dark:text-gray-200">
                    {suggestedUser?.username}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {isOnline ? "online" : "offline"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>
      {selectedUser ? (
        <section className="w-3/4 p-4 dark:bg-gray-900 flex flex-col">
          <Messages selectedUser={selectedUser} />
          <div className="mt-4 flex space-x-2">
            <input
              type="text"
              value={textMessage}
              onChange={(e) => setTextMessage(e.target.value)}
              className="flex-1 p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all"
              placeholder="Type a message..."
            />
            <Button
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-500 transition-all"
              onClick={() => sendMessageHandler(selectedUser?._id)}
            >
              Send
            </Button>
          </div>
        </section>
      ) : (
        <div className="flex flex-col items-center justify-center w-3/4 p-4 text-center dark:bg-gray-900">
          <MessageCircle className="w-16 h-16 text-gray-500 dark:text-gray-400 mb-4" />
          <h1 className="text-2xl font-bold mb-2 dark:text-gray-200">
            Your Messages
          </h1>
          <span className="text-gray-500 dark:text-gray-400">
            Send a message to start the conversation
          </span>
        </div>
      )}
    </div>
  );
};

export default ChatPage;
