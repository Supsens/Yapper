import express from "express";
import { addNewPost, getAllPost, getuserpost, likePost, unlikePost, addcomment, getCommentsofPost, deletePost, bookmarkPost } from "../controllers/post.controllers.js";
import  isAuthenticated  from "../middlewares/isAuthenthicated.js";
import  upload  from "../middlewares/multer.js";

export const PostRouter = express.Router();

PostRouter.post('/add', isAuthenticated, upload.single('image'), addNewPost);
PostRouter.get('/all', isAuthenticated, getAllPost);
PostRouter.get('/userpost/all', isAuthenticated, getuserpost);
PostRouter.post('/:id/like',isAuthenticated ,likePost);
PostRouter.post('/:id/dislike',isAuthenticated , unlikePost);
PostRouter.post('/:id/comment', isAuthenticated, addcomment);
PostRouter.get('/:id/comment/all', isAuthenticated, getCommentsofPost);
PostRouter.delete('/delete/:id', isAuthenticated, deletePost);
PostRouter.get('/:id/bookmark', isAuthenticated, bookmarkPost);
