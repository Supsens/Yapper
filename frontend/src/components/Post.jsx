import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import React, { useState } from "react";
import { Dialog } from "./ui/dialog";
import { DialogContent, DialogTrigger } from "@radix-ui/react-dialog";
import { Bookmark, MessageCircle, MoreHorizontal, Send } from "lucide-react";
import { Button } from "./ui/button";
import { FaRegHeart } from "react-icons/fa";
import { FaHeart } from "react-icons/fa";
import CommnetDialog from "./CommnetDialog";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import axios from "axios";
import { setPosts, setSelectedPosts } from "@/redux/postSlice";
import { Link } from "react-router-dom";

const Post = ({ post }) => {
  const {user}=useSelector(store=>store.auth)
  const {posts}=useSelector((store)=>store.post)
  const dispatch=useDispatch()
  const [like , setlike]=useState(post.likes.includes(user?._id)||false)
  const [text, setText] = useState("");
  const [open, setopen] = useState(false);
  const [postlike,setpostlike]=useState(post.likes.length)
  const [comments,setcomments]=useState(post.comments)
  const eventhandler = (e) => {
    const input = e.target.value;
    if (input.trim()) {
      setText(e.target.value);
    } else {
      setText("");
    }
  };

  const likedislikehandler = async () => {
    try {
        const action = like ? "dislike" : "like";
        const res = await axios.post(`https://yapper-8ny9.onrender.com/api/v1/post/${post?._id}/${action}`,{}, { withCredentials: true });
        if (res.data.success) {
            const updatedLikes = like ? postlike - 1 : postlike + 1;
            setpostlike(updatedLikes);
            setlike((prev) => !prev);
            toast.success(res.data.message);

            // Update Redux state if necessary
            const updatedPosts = posts.map((p) =>
                p._id === post._id ? { ...p, likes: res.data.post.likes } : p
            );
            dispatch(setPosts(updatedPosts));
        }
    } catch (error) {
        console.log(error);
        toast.error(error.response.data.message);
    }
};
const Bookmarkhandler = async () => {
  try {
      const res = await axios.get(`https://yapper-8ny9.onrender.com/api/v1/post/${post?._id}/bookmark`, {
        withCredentials: true });
      if (res.data.success) {
          toast.success(res.data.message);
      }
  } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
  }
};

const commenthandler = async () => {
  try {
      const res = await axios.post(`https://yapper-8ny9.onrender.com/api/v1/post/${post?._id}/comment`, {text}, {
        headers:{
          'Content-Type':'application/json'
        },
        withCredentials: true });
      if (res.data.success) {
         const updatedcommentdata=[...comments,res.data.comment]
         setcomments
         (updatedcommentdata)
         const updatedPostdata=posts.map(p=>p._id===post._id?
          {...p,comments:updatedcommentdata}:p
         );
         dispatch(setPosts(updatedPostdata))
          toast.success(res.data.message);
          setText("")
      }
  } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
  }
};
  
  const deletehandler=async()=>{
    try {
      const res=await axios.delete(`https://yapper-8ny9.onrender.com/api/v1/post/delete/${post?._id}`,{withCredentials:true})
      if(res.data.success)
      {

        const updatedPost=posts.filter((item)=>item._id!=post?._id)
          dispatch(setPosts(updatedPost))
        toast.success(res.data.message)
      }

    } catch (error) {
      console.log(error);
      
      toast.error(error.response.data.message)
    }
  }
  return (
    <div className="p-4 border-b border-gray-200 dark:border-green-400 transition-colors duration-200">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-3">
         
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
          <h1 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-white">
            {post.author.username}
          </h1>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <MoreHorizontal className="cursor-pointer text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors" />
          </DialogTrigger>
          <DialogContent className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-2xl transform transition-all duration-300 ease-out scale-105 origin-bottom-right">
            {
               post.author?._id!==user?._id &&
               <Button className="w-full mt-2 text-red-500 hover:bg-red-100 dark:hover:bg-red-900 transition-colors">Unfollow</Button>
            } 
        
            <Button className="w-full mt-2 text-blue-500 hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors">Add to Favorites</Button>
            {
              user && user._id===post?.author._id&&
              <Button onClick={deletehandler} className="w-full mt-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">Delete</Button>
            }
            
          </DialogContent>
        </Dialog>
      </div>

      <img
        src={post.image}
        alt="Post"
        className="w-full h-64 sm:h-80 md:h-96 object-cover rounded-lg shadow-md"
      />

      <div className="flex justify-between items-center my-4">
        <div className="flex items-center space-x-4">
          {like?<FaHeart className="text-red-500 dark:text-red-600 cursor-pointer hover:text-red-500 dark:hover:text-red-400 transition-colors" onClick={likedislikehandler} />:<FaRegHeart className="text-red-500  dark:text-red-600
          cursor-pointer hover:text-red-500 dark:hover:text-red-400 transition-colors" onClick={likedislikehandler} />}
          
          <MessageCircle
           
            onClick={()=>dispatch(setSelectedPosts(post),setopen(true))}
            className="text-gray-500 dark:text-gray-400 cursor-pointer hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
          />
          <Send className="text-gray-500 dark:text-gray-400 cursor-pointer hover:text-green-500 dark:hover:text-green-400 transition-colors" />
        </div>
        <Bookmark className="text-gray-500 dark:text-gray-400 cursor-pointer hover:text-yellow-500 dark:hover:text-yellow-400 transition-colors" onClick={Bookmarkhandler} />
      </div>

      <span className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2 block" >

        {postlike} likes
      </span>

      <p className="mb-4 text-gray-700 dark:text-gray-300">
        <span className="font-semibold text-gray-800 dark:text-white mr-2">{post.author.username}</span>
        {post.caption}
      </p>

      <span
         onClick={()=>dispatch(setSelectedPosts(post),setopen(true))}
        className="text-sm text-blue-500 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
      >
        {(comments.length>0)?<span>View all {comments.length} comments</span>
        :<span>View all comments</span>}
        
      </span>

      <CommnetDialog open={open} setopen={setopen} post={post} />

      <div className="mt-4 flex items-center space-x-2">
        <input
          type="text"
          placeholder="Add a comment"
          value={text}
          onChange={eventhandler}
          className="flex-1 p-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 transition-all"
        />
        {text && (
          <span  onClick={commenthandler}className="text-blue-500 font-semibold cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            Post
          </span>
        )}
      </div>
    </div>
  );
};

export default Post;
