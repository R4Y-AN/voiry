import { initializeApp } from "firebase/app";
import { getDatabase, ref, push, serverTimestamp } from "firebase/database";
import User from '../models/user.model.js';
import RecentUser from '../models/recentChats.model.js';
import { verifyUserCredentials } from '../utils/verifyUser.js';


// firebase configg
const firebaseConfig = {
    apiKey: process.env.apiKey,
    authDomain: process.env.authDomain,
    databaseURL: process.env.databaseURL,
    projectId: 'voiry-webapp',
    storageBucket: process.env.storageBucket,
    messagingSenderId: process.env.messagingSenderId,
    appId: process.env.appId,
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export const sendMessage = async (req, res, next) => {
    const { receiverId, message } = req.body;
    if (receiverId === req.user.id) {
        return res.status(200).json({ success: false, message: "Invalid Receiver Id." });
    }

    try {
        await verifyUserCredentials(req.user.id, req.user.passwordChangedTime);
        const senderUser = await User.findById(req.user.id);
        const receiverUser = await User.findById(receiverId);

        const recentlyMessageSenderList = await RecentUser.findOne({ userId: req.user.id });
        const recentlyMessageReceiverList = await RecentUser.findOne({ userId: receiverId });

        if (!senderUser || !receiverUser || !recentlyMessageSenderList || !recentlyMessageReceiverList) {
            return res.status(404).json({ success: false, error: "User not found!" });
        }

        // message object contains the message and the sender and the time of sending the messagee
        const messageObject = {
            message: message,
            sender: senderUser.username,
            timestamp: serverTimestamp(),
        };

        // storing the message in the firebase realtime db
        const senderRef = ref(db, `chats/${senderUser.username}/${receiverUser.username}`);
        const receiverRef = ref(db, `chats/${receiverUser.username}/${senderUser.username}`);

        await push(senderRef, messageObject);
        await push(receiverRef, messageObject);

        const senderObject = { profilePicture: receiverUser.profilePicture, username: receiverUser.username, message:message, timestamp: new Date(), };
        const receiverObject = { profilePicture: senderUser.profilePicture, username: senderUser.username, message:message, timestamp: new Date(), };

        // Update recentlyMessageSenderList and recentlyMessageReceiverList 
        updateRecentList(recentlyMessageSenderList, receiverUser._id, senderObject);

        updateRecentList(recentlyMessageReceiverList, senderUser._id, receiverObject);

        // Respond with success
        res.status(200).json({ success: true, message: "Message sent successfully!" });
    } catch (err) {
        next(err);
    }
};


const updateRecentList = (recentList, userId, userObject) => {
    const existingIndex = recentList.usersList.findIndex(item => item.userId.toString() === userId.toString());

    if (existingIndex !== -1) {
        recentList.usersList.splice(existingIndex, 1);
    }

   
    recentList.usersList.unshift({ userId, ...userObject });
    recentList.save();
};


export const recentlyChatUserList = async(req,res,next) => {
    try{
        await verifyUserCredentials(req.user.id, req.user.passwordChangedTime);
        const userList = await RecentUser.findOne({ userId: req.user.id }); 
        if(!userList){
            return res.status(200).json({success:false,error:"No User Found!"});
        }
        const recentlyChatUsers = userList.usersList;
        return res.status(200).json({success:true,recentlyChatUsers});
    }catch(err){
        next(err);
    }
}