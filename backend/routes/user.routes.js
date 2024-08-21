import express from "express";
import { editProfile, followOrUnfollow, getProfile, getsuggestedUsers, login, logout, register } from "../controllers/user.controller.js";
import isAuthenticated  from "../middlewares/isAuthenthicated.js";
import  upload  from "../middlewares/multer.js";

export const UserRouter = express.Router();

UserRouter.post('/register', register);
UserRouter.post('/login', login);
UserRouter.get('/logout', logout);
UserRouter.post('/profile/edit', isAuthenticated, upload.single('profilePicture'), editProfile);
UserRouter.get('/:id/profile', isAuthenticated, getProfile);
UserRouter.get('/suggested', isAuthenticated, getsuggestedUsers);
UserRouter.post('/followorunfollow/:id', isAuthenticated, followOrUnfollow);
