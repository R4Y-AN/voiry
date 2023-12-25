import User from '../models/user.model.js';
import { errorHandler } from '../utils/error.js';
import { verifyUserCredentials } from '../utils/verifyUser.js';
import audioPost from '../models/audiopost.model.js';

export const followUser = async (req, res, next) => {
    try {
      const { userId } = req.params; // Id of the user to be followed
  
      // Ensure the user is not trying to follow themselves
      if (userId === req.user.id) {
        return res.status(400).json('Cannot follow yourself');
      }
      await verifyUserCredentials(req.user.id, req.user.passwordChangedTime);
      // Find the user who is trying to follow
      const followerUser = await User.findById(req.user.id);
  
      // Find the user to be followed
      const followingUser = await User.findById(userId);
  
      // Check if both users exist
      if (!followerUser || !followingUser) {
        return res.status(404).json('User not found');
      }
  
      // Check if the user is already being followed
      const isAlreadyFollowing = followerUser.following.includes(userId);
  
      if (isAlreadyFollowing) {
        // If already following, unfollow the user
        followerUser.following = followerUser.following.filter((id) => id !== userId);
        await followerUser.save();
  
        // Update the followingUser's follower list
        followingUser.follower = followingUser.follower.filter((id) => id !== req.user.id);
        await followingUser.save();
  
        return res.status(200).json({followed:false});
      } else {
        // If not already following, follow the user
        followerUser.following.push(userId);
        await followerUser.save();
  
        
        followingUser.follower.push(req.user.id);
        await followingUser.save();
  
        return res.status(200).json({followed:true});
      }
    } catch (error) {
      next(error);
    }
  };
  

  

export const getAudiosFromFollowing = async (req, res, next) => {
    try {
      // Ensure the user's credentials are valid
      await verifyUserCredentials(req.user.id, req.user.passwordChangedTime);
  
      const currentUser = await User.findById(req.user.id);
      if (!currentUser) {
        return res.status(404).json('User not found');
      }
  
    
      const followingUsers = await User.find({ _id: { $in: currentUser.following } });
  
      
      const followingUserIds = followingUsers.map(user => user._id);

      const audiosFromFollowing = await audioPost
        .find({ userId: { $in: followingUserIds } })
        .sort({ createdAt: -1 });
  
      return res.status(200).json(audiosFromFollowing);
    } catch (error) {
      next(error);
    }
  };
  