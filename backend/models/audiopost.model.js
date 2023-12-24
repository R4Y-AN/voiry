import mongoose from 'mongoose';

const dataScheme = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,   
    },
    author: {
        type: String,
        required: true,   
    },
    playCount: {
        type: Number,
        default: 0,
    },
    likes: {
        type:  [String],
        default: [],
    },
    userId: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    shortDesc: {
      type: String,
      required: true,
    },
    thumbnail: {
        type: String,
        required: true,
    },
    audioFilePath: {
        type: String,
        required: true,
    },
  },
  { timestamps: true }
);

const audioPost = mongoose.model('audio_post', dataScheme);

export default audioPost;