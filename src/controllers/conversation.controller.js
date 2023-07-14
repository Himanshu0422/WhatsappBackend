import createHttpError from "http-errors";
import logger from "../configs/logger.config.js";
import { createConversation, doesConversationExist, populateConversation, getUserConversations } from "../services/conversation.service.js";
import { findUser } from "../services/user.service.js";

export const create_open_conversation = async (req, res, next) => {
    try {
        const sender_id = req.user.userId;
        const { reciever_id } = req.body;
        if(!reciever_id){
            logger.error("Please provide the user id you wanna start a conversation with!");
            res.status(400);
            throw createHttpError.BadGateway("Oops...Something went wrong!");
        }

        const existed_conversation = await doesConversationExist(
            sender_id,
            reciever_id
        )

        if(existed_conversation){
            res.json(existed_conversation);
        }else{
            let reciever_user = await findUser(reciever_id);
            let convoData = {
                name: reciever_user.name,
                isGroup: false,
                users: [sender_id, reciever_id],
            }
            const newConvo = await createConversation(convoData);
            const populatedConvo = await populateConversation(
                newConvo._id,
                "users",
                "-password"
            );
            res.status(200).json(populatedConvo);
        }
    } catch (error) {
        next(error);
    }
};

export const getConversations = async (req, res, next) => {
    try {
        const user_id = req.user.userId;
        const conversations = await getUserConversations(user_id);
        res.status (200). json (conversations);
    } catch (error) {
        next (error);
    }
}