import express from "express";
import { sendMessage, getMessage } from "../controllers/message.controllers.js";
import  isAuthenticated  from "../middlewares/isAuthenthicated.js";

export const MessageRouter = express.Router();

MessageRouter.post('/send/:id', isAuthenticated, sendMessage);
MessageRouter.get('/all/:id', isAuthenticated, getMessage);

