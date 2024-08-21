import { Conversation } from "../models/conversation.model.js";
import { Message } from "../models/message.model.js";
import { getReciverSocketId, io } from "../sockets/socket.js";

export const sendMessage = async (req, res) => {
    try {

        const senderId = req.id;
        const reciverId = req.params.id;
        const { message } = req.body;

        let conversation = await Conversation.findOne({
            participants: {
                $all: [senderId, reciverId]
            }
        });
        //establish the conversation if not started yet....

        if (!conversation) {
            conversation = await Conversation.create({
                participants: [senderId, reciverId]
            })
        };

        const newmessage = await Message.create({
            senderId,
            reciverId,
            message
        })

        if (newmessage) {
            conversation.messages.push(newmessage._id)
        }

        await conversation.save()
        await newmessage.save();

        //implement socket io fro real time data transfer
        const receiverSocketId=getReciverSocketId(reciverId);

        if(receiverSocketId)
        {
            io.to(receiverSocketId).emit('newMessage',newmessage);
        }
        return res.status(200).json({
            success: true,
            newmessage
        })

    } catch (error) {
        console.log(error);

    }
}



export const getMessage = async (req, res) => {
    try {
        const senderId = req.id;
        const reciverId = req.params.id;

        let conversation = await Conversation.findOne({
            participants: {
                $all: [senderId, reciverId]
            }
        }).populate('messages');


        if (!conversation) {

            return res.status(200).json({
                success: true,
            messages:[]
            })
        };

        return res.status(200).json({
            success: true,
        messages:conversation?.messages
        })

    } catch (error) {
        console.log(error);
    }
}