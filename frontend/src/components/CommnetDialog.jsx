import { Dialog, DialogContent, DialogOverlay } from "@radix-ui/react-dialog";
import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Comment from "./Comment.jsx";
import axios from "axios";
import { toast } from "sonner";
import { setPosts } from "@/redux/postSlice.js";

const CommnetDialog = ({ open, setopen, post }) => {
  const [text, setText] = useState("");
  const { posts } = useSelector((store) => store.post);
  const { user } = useSelector((store) => store.auth);
  const [comments, setcomments] = useState(post.comments);
  const dispatch = useDispatch();
  const eventhandler = (e) => {
    if (e.target.value.trim()) {
      setText(e.target.value);
    } else {
      setText("");
    }
  };

  const SendMessageHandler = async () => {
    try {
      const res = await axios.post(
        `https://yapper-8ny9.onrender.com/api/v1/post/${post?._id}/comment`,
        { text },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        const updatedcommentdata = [...comments, res.data.comment];
        setcomments(updatedcommentdata);
        const updatedPostdata = posts.map((p) =>
          p._id === post._id ? { ...p, comments: updatedcommentdata } : p
        );
        dispatch(setPosts(updatedPostdata));
        toast.success(res.data.message);
        setText("");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setopen}>
      <DialogOverlay className="fixed inset-0 bg-black bg-opacity-50 z-50" />
      <DialogContent className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-2xl max-w-lg w-full z-50">
        <img
          src={post.image}
          alt="post_img"
          className="w-full h-64 object-cover rounded-lg mb-4"
        />
        <div>
          <div className="flex items-center space-x-4 mb-4">
            <Link
              to={`/profile/${post.author._id}`}
              className="flex items-center space-x-3 mb-4"
            >
              <Avatar className="w-14 h-14 md:w-14 md:h-14 rounded-full overflow-hidden">
                <AvatarImage
                  src={post.author.profilePicture}
                  className="w-full h-full object-cover"
                />
                <AvatarFallback className="bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200 flex items-center justify-center">
                  {post.author.username.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </Link>
            <span className="text-gray-600 dark:text-gray-300">
              {post.caption}
            </span>
          </div>

          <div className="comments max-h-60 overflow-y-auto space-y-2 mb-4">
            {post.comments.map((comment) => (
              <Comment key={comment._id} comment={comment} />
            ))}
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="text"
              placeholder="Add a comment"
              value={text}
              onChange={eventhandler}
              className="flex-1 p-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 transition-all"
            />
            <button
              disabled={!text.trim()}
              onClick={SendMessageHandler}
              className={`${
                text.trim()
                  ? "bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
                  : "bg-gray-300 dark:bg-gray-700"
              } text-white px-4 py-2 rounded-lg transition-all`}
            >
              Send
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CommnetDialog;
