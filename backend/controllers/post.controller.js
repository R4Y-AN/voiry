import audioPost from '../models/audiopost.model.js';
import User from '../models/user.model.js';
import { errorHandler } from '../utils/error.js';
import { verifyUserCredentials } from '../utils/verifyUser.js';


export const post = async (req, res, next) => {
    if (!req.body){
        return next(errorHandler(412, 'Enough data not found.'));
    }
    const {title,thumbnail,audioFilePath,shortDesc,type} = req.body;
    if(!title||!thumbnail|!audioFilePath||!shortDesc||!type){
        return next(errorHandler(412, 'Enough data not found.'));
    }

    try{
        const userId = req.user.id;
         // Verify if the user's password has been changed since the login
        await verifyUserCredentials(req.user.id, req.user.passwordChangedTime);

        const user = await User.findById(userId);
        const author = user.username; 
        // Post functionality here ->
        const newPost = new audioPost({title,author,thumbnail,audioFilePath,userId,shortDesc,type});
        await newPost.save();
        res.status(201).json({ message: 'Post Successfully Created.' , post_data:newPost });
    }catch(err){
        next(err);
    }
};

export const getPostById = async (req,res,next) =>{
    const id = req.params.audioId;
    try{
        const post = await audioPost.findById(id);
        if(!post){
            return res.status(404).json("No Post Found!");
        }
        return res.status(200).json(post);
    }catch(err){
        next(err);
    }
}


export const findUserPosts = async (req, res, next) => {
    try{
        // Verify if the user's password has been changed since the login
        await verifyUserCredentials(req.user.id, req.user.passChangedTime);
        // getting my posts by userId ->
        const posts = await audioPost.find({ userId : req.params.id});
        return res.status(200).json(posts);
    }catch(err){
        next(err);
    }
};

// find the current logged in user posts
export const findMyPosts = async (req, res, next) => {

    try{
        const userId = req.user.id;
        // Verify if the user's password has been changed since the login
        await verifyUserCredentials(req.user.id, req.user.passChangedTime);
        // getting my posts by userId ->
        const posts = await audioPost.find({ userId });
        return res.status(200).json(posts);
    }catch(err){
        next(err);
    }
};

export const explorer = async (req,res,next)=>{
    try{
        const story = await audioPost.find({ type:"story" });
        const bedtimestory = await audioPost.find({ type:"bedtimestory" });
        const song = await audioPost.find({ type:"song" });
        const horror = await audioPost.find({ type:"horror" });
        const funny = await audioPost.find({ type:"funny" });
        const romantic = await audioPost.find({ type:"romantic" });

        return res.status(200).json({story,bedtimestory,song,horror,funny,romantic});
    }catch(err){    
        next(err);
    }
}

// used to retieve the same typed post 
export const itembytype = async (req,res,next)=>{
    const type = req.params.type;
    try{
        const posts = await audioPost.find({ type });
        return res.status(200).json(posts);
    }catch(err){    
        next(err);
    }
}

// update the post
export const updatePost = async (req, res, next) => {
    try {
        const postId = req.params.audioId;
        const { title, shortDesc, type } = req.body;

        // Verify if the user's password has been changed since the login
        await verifyUserCredentials(req.user.id, req.user.passwordChangedTime);

        // Check if the post exists and belongs to the user
        const post = await audioPost.findById(postId);
        if (!post) {
            return next(errorHandler(404, 'Post not found.'));
        }

        if (post.userId !== req.user.id) {
            return next(errorHandler(401, 'You can only update your own posts.'));
        }

        // Update post fields
        if (title) post.title = title;
        if (shortDesc) post.shortDesc = shortDesc;
        if (type) post.type = type;

        await post.save();

        return res.status(200).json({
            success: true,
            message: 'Post updated successfully.',
            updatedPost: post
        });
    } catch (err) {
        next(err);
    }
};

export const myFeed = async (req, res, next) => {
    try {
        const posts = await audioPost.find().limit(150);
        return res.status(200).json(posts);
    } catch (err) {
        next(err);
    }
};

// search for the posts
export const searchPost = async (req, res, next) => {
    const searchItemTitle = req.params.searchTitle;
    try {
      const posts = await audioPost.find({ title: { $regex: new RegExp(searchItemTitle, 'i') } }).limit(150);
      return res.status(200).json(posts);
    } catch (err) {
      next(err);
    }
  };

export const deletePost = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const postId = req.params.audioId;


        // Verify if the user's password has been changed since the login
        await verifyUserCredentials(req.user.id, req.user.passwordChangedTime);

        // check if post is exsits
        const post = await audioPost.findById(postId);
        if (!post) {
            return next(errorHandler(404, 'Post not found.'));
        }

        // if the current logged in user is not the owner of the post then the user should not allowed to delte the post
        if (post.userId !== userId) {
            return next(errorHandler(401, 'You can only delete your own posts.'));
        }

        // delete the post from db
        await audioPost.findByIdAndDelete(postId);

        return res.status(200).json({
            success: true,
            message: 'Post deleted successfully.',
            post: post
        });
    } catch (err) {
        next(err);
    }
};



export const likePost = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const postId = req.body.postId;

        // Verify if the user's password has been changed since the login
        await verifyUserCredentials(req.user.id, req.user.passwordChangedTime);

        // Check if the post exists and belongs to another user (not the one liking it)
        const post = await audioPost.findById(postId);
        if (!post) {
            return next(errorHandler(404, 'Post not found.'));
        }

        if (post.userId === userId) {
            return next(errorHandler(400, 'You cannot like your own post.'));
        }

        // Check if the user has already liked the post
        const likedIndex = post.likes.indexOf(userId);
        if (likedIndex !== -1) {
            // User already liked the post, so unlike it
            post.likes.splice(likedIndex, 1);
        } else {
            // User has not liked the post, so like it
            post.likes.push(userId);
        }

        await post.save();

        return res.status(200).json({
            success: true,
            message: likedIndex !== -1 ? 'Post unliked successfully.' : 'Post liked successfully.',
            post: post
        });
    } catch (err) {
        next(err);
    }
};

export const saveAudio = async (req, res, next) => {
    const audioId = req.body.audioId;
  
    if (!audioId) {
      return res.status(400).json({ success: false, error: "No audio id provided!" });
    }
  
    try {
      // Ensure the user's credentials are valid
      await verifyUserCredentials(req.user.id, req.user.passwordChangedTime);
  
      // Find the user who is trying to get audios from followed users
      const currentUser = await User.findById(req.user.id);
      const audio = await audioPost.findById(audioId);
  
      if (!currentUser || !audio) {
        return res.status(404).json({ success: false, error: 'User not found or Invalid Audio Id' });
      }
  
      // Check if the audio is already saved
      const alreadySaved = currentUser.savedAudios.includes(audioId);
  
      if (alreadySaved) {
        // Audio is already saved, so remove it from savedAudios array
        currentUser.savedAudios = currentUser.savedAudios.filter(savedAudioId => savedAudioId !== audioId);
        currentUser.save();
        return res.status(200).json({ success: true, message: "Successfully unsaved the audio!",saved:true });
      }
  
      // Audio is not saved yet, so save it
      currentUser.savedAudios.push(audioId);
      currentUser.save();
      return res.status(200).json({ success: true, message: "Successfully saved the audio!",saved:false });
    } catch (error) {
      next(error);
    }
  }
  
  
  
  export const getSavedPosts = async (req, res, next) => {
    try {
      await verifyUserCredentials(req.user.id, req.user.passwordChangedTime);
  
      const currentUser = await User.findById(req.user.id);
      if (!currentUser) {
        return res.status(404).json('User not found');
      }
  
      const savedAudioIds = currentUser.savedAudios;
  
      const savedAudios = await audioPost
        .find({ _id: { $in: savedAudioIds } })
        .sort({ createdAt: -1 });
  
      return res.status(200).json(savedAudios);
    } catch (error) {
      next(error);
    }
  };