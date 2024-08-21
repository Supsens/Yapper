import React, { useEffect, useRef, useState } from "react";
import { Dialog, DialogContent, DialogHeader } from "./ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "./ui/button";
import { readFileAsDataUrl } from "@/lib/utils.js";
import { Loader2 } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "@/redux/postSlice";

const CreatePost = ({ open, setopen }) => {
  const dispatch = useDispatch();
  const { posts } = useSelector((store) => store.post);
  const imageref = useRef();
  const [file, setFile] = useState(null); 
  const [caption, setCaption] = useState("");
  const [imagePreview, setImagePreview] = useState(""); 
  const [loading, setloading] = useState(false);
  const { user } = useSelector((store) => store.auth);

  useEffect(() => {
    if (open) {
      // Reset the state when the dialog is opened
      setFile(null);
      setCaption("");
      setImagePreview("");
    }
  }, [open]);

  const fixChangeHandler = async (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const dataUrl = await readFileAsDataUrl(selectedFile);
      setImagePreview(dataUrl); 
    }
  };

  const createPosthandler = async () => {
    if (!file) {
      toast.error("Please select an image to upload");
      return;
    }

    const formData = new FormData();
    formData.append("caption", caption);
    formData.append("image", file);

    try {
      setloading(true);
      const res = await axios.post(
        "https://yapper-8ny9.onrender.com/api/v1/post/add",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        dispatch(setPosts([res.data.post, ...posts]));
        toast.success(res.data.message);
        setopen(false);
      } else {
        toast.error("Something went wrong!");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred");
    } finally {
      setloading(false);
    }
  };

  return (
    <Dialog open={open}>
      <DialogContent
        className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-2xl max-w-lg w-full"
        onInteractOutside={() => setopen(false)}
      >
        <DialogHeader className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
          Create New Post
        </DialogHeader>

        <div className="flex items-center space-x-4 mb-4">
          <Avatar className="w-12 h-12">
            <AvatarImage src={user?.profilePicture} alt="img" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
              {user?.username}
            </h1>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Bio here...
            </span>
          </div>
        </div>

        <Textarea
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="Write a caption..."
          className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-lg mb-4 dark:bg-gray-900 dark:text-gray-200"
        />

        {imagePreview && (
          <div className="mb-4">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-full h-64 object-cover rounded-lg"
            />
          </div>
        )}

        <input
          ref={imageref}
          type="file"
          onChange={fixChangeHandler}
          className="hidden"
        />
        <Button
          onClick={() => imageref.current.click()}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-lg mb-4"
        >
          Select from Computer
        </Button>

        {imagePreview &&
          (loading ? (
            <Button
              disabled
              className="w-full bg-gray-300 text-gray-500 font-semibold py-2 rounded-lg flex items-center justify-center"
            >
              <Loader2 className="animate-spin mr-2" />
              Please Wait
            </Button>
          ) : (
            <Button
              onClick={createPosthandler}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-lg"
            >
              Post
            </Button>
          ))}
      </DialogContent>
    </Dialog>
  );
};

export default CreatePost;
