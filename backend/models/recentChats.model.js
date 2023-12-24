import mongoose from 'mongoose';

const recent_chat = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: false,
    },
    usersList: [
      {
        userId: {
          type: String,
          required: true,
        },
        profilePicture: {
          type: String,
          required: true,
        },
        username: {
          type: String,
          required: true,
        },
        message:{
          type: String,
          required: true,
        },
        timestamp:{
          type: String,
          required: true,
        }
      },
    ],
    blockedUserList: {
      type:[String],
      default:[]
    },
  },
  { timestamps: true }
);

const RecentUser = mongoose.model('recent_chat_user', recent_chat);

export default RecentUser;