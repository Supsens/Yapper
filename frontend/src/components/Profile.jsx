import { useGetUserProfile } from "@/hooks/useGetUserProfile";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { Button } from "./ui/button";
import { Heart, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";

const Profile = () => {
  const params = useParams();
  const userId = params.id;
  const [active, setActive] = useState("posts");
  useGetUserProfile(userId);

  const { userprofile, user } = useSelector((store) => store.auth);
  const isLogged = user?._id === userprofile?._id;
  const isFollow = true;

  const tabChange = (tab) => {
    setActive(tab);
  };

  const displayedPost =
    active === "posts" ? userprofile?.posts : userprofile?.bookmarks;

  return (
    <div className="max-w-screen-lg mx-auto mt-8">
      <div className="flex flex-col md:flex-row md:space-x-8">
        <section className="flex justify-center md:justify-start">
          <Avatar className="w-28 h-28 md:w-36 md:h-36 rounded-full overflow-hidden">
            <AvatarImage
              src={userprofile?.profilePicture}
              className="w-full h-full object-cover"
            />
            <AvatarFallback className="bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200 flex items-center justify-center">
              {userprofile?.username.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </section>

        <section className="flex-1">
          <div className="text-center md:text-left">
            <div className="flex flex-col md:flex-row md:items-center md:space-x-4 mt-4 md:mt-0">
              <span className="text-2xl font-semibold dark:text-gray-100">
                {userprofile?.username}
              </span>
              {isLogged ? (
                <>
                  <Link to={'/account/edit'}>
                    <Button className="mt-2 md:mt-0 dark:bg-gray-800 dark:text-gray-100">
                      Edit Profile
                    </Button>
                  </Link>
                  <Button className="mt-2 md:mt-0 dark:bg-gray-800 dark:text-gray-100">
                    View Archives
                  </Button>
                  <Button className="mt-2 md:mt-0 dark:bg-gray-800 dark:text-gray-100">
                    Add Tools
                  </Button>
                </>
              ) : isFollow ? (
                <>
                  <Button className="mt-2 md:mt-0 dark:bg-gray-800 dark:text-gray-100">
                    UnFollow
                  </Button>
                </>
              ) : (
                <>
                  <Button className="mt-2 md:mt-0 dark:bg-gray-800 dark:text-gray-100">
                    Follow
                  </Button>
                </>
              )}
            </div>
            <div className="mt-4 flex justify-between md:justify-start md:space-x-8">
              <p className="dark:text-gray-300">
                <span className="font-semibold">{userprofile?.posts.length}</span>{" "}
                posts
              </p>
              <p className="dark:text-gray-300">
                <span className="font-semibold">{userprofile?.followers.length}</span>{" "}
                followers
              </p>
              <p className="dark:text-gray-300">
                <span className="font-semibold">{userprofile?.following.length}</span>{" "}
                following
              </p>
            </div>
            <div className="mt-4">
              <span className="text-gray-600 dark:text-gray-400">
                {userprofile?.bio || "Bio here..."}
              </span>
            </div>
          </div>
        </section>
      </div>

      <div className="mt-8">
        <div className="border-t border-gray-300 dark:border-gray-600"></div>
        <div className="flex justify-center space-x-8 mt-4">
          <span
            className={`text-sm font-semibold cursor-pointer ${
              active === "posts"
                ? "text-black dark:text-white"
                : "text-gray-500 dark:text-gray-400"
            }`}
            onClick={() => tabChange("posts")}
          >
            POSTS
          </span>
          <span
            className={`text-sm font-semibold cursor-pointer ${
              active === "saved"
                ? "text-black dark:text-white"
                : "text-gray-500 dark:text-gray-400"
            }`}
            onClick={() => tabChange("saved")}
          >
            SAVED
          </span>
        </div>
        <div className="grid grid-cols-3 gap-4 mt-4">
          {displayedPost?.map((post) => (
            <div key={post._id} className="relative group">
              <img
                src={post.image}
                alt={post.caption}
                className="w-full h-48 object-cover rounded"
              />
              <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-4">
                <Button className="flex items-center space-x-2 dark:bg-gray-800 dark:text-gray-100">
                  <Heart className="text-white" />
                  <span className="text-white">{post?.likes.length}</span>
                </Button>
                <Button className="flex items-center space-x-2 dark:bg-gray-800 dark:text-gray-100">
                  <MessageCircle className="text-white" />
                  <span className="text-white">{post?.comments.length}</span>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Profile;
