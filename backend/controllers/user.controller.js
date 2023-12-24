import User from '../models/user.model.js';
import { errorHandler } from '../utils/error.js';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { verifyUserCredentials } from '../utils/verifyUser.js';
import audioPost from '../models/audiopost.model.js';

const TOKEN_EXPIRE_TIME = 30;

export const user_social_details = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json('User not found');
    }

    // Get the count of followers
    const followersCount = user.follower.length;

    // Get the count of following users
    const followingCount = user.following.length;

    // Get all audioposts made by the user
    const userAudioposts = await audioPost.find({ userId: user._id });

    // Calculate the total number of audioposts made by the user
    const totalAudioposts = userAudioposts.length;

   
    let totalLikes = 0;
    userAudioposts.forEach(audiopost => {
      totalLikes += audiopost.likes.length;
    });

    // Return the social details
    return res.status(200).json({
      followersCount,
      followingCount,
      totalAudioposts,
      totalLikes,
    });
  } catch (error) {
    next(error);
  }
};
             




// delete user
export const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if(!user){
      return res.status(200).json('User not found!');
    }
   
    // Verify user's credentials and check password change status
    await verifyUserCredentials(req.user.id, req.user.passwordChangedTime);

    const password = req.body.password;
    const validPassword = bcryptjs.compareSync(password, user.password);
    
    if (!validPassword) return next(errorHandler(401, 'wrong credentials'));

    await User.findByIdAndDelete(req.user.id);

    return res.status(200).json('User has deleted successfully.');
  } catch (error) {
    next(error);
  }

}



// get other user data
export const otherProfile = async (req, res, next) => {
  const token = req.body.access_token;

  try {
    const username = req.params.id;
    let isFollowed = false;
    const user = await User.findOne({ username }).select('-following -password -passwordChangedTime -email -showFollowingCount -createdAt -updatedAt -__v');

    if (!user) {
      return res.status(404).json('User not found!');
    }

    // Get all audioposts made by the user
    const userAudioposts = await audioPost.find({ userId: user._id }).sort({ createdAt: -1 });

    if (token) {
      jwt.verify(token, process.env.JWT_SECRET, (err, usr) => {
        if (!err) {
          isFollowed = user.follower.includes(usr.id);
        }
      });
    }

    user.follower = isFollowed;
   

    return res.status(200).json({user:user,userAudioposts});
  } catch (error) {
    next(error);
  }
};


export const info = async(req,res,next)=>{
  try {
    const id = req.user.id;
    await verifyUserCredentials(id, req.user.passwordChangedTime);
    const user = await User.findById(id).select('-password -passwordChangedTime');
    if(user){
      const userAudioposts = await audioPost.find({ userId: id}).sort({ createdAt: -1 });
      return res.status(201).json({user,userAudioposts});
    }
   return res.status(401).json({ message: 'No User detectd' });
  } catch (error) {
    next(error);
  }
}

export const refreshToken = async(req,res,next)=>{
  
  try{
    await verifyUserCredentials(req.user.id, req.user.passwordChangedTime);
    const token = jwt.sign(
      { id: req.user.id, passwordChangedTime: req.user.passwordChangedTime },
      process.env.JWT_SECRET,
      { expiresIn: TOKEN_EXPIRE_TIME } // Set expiration time in seconds
    );
    res.status(200).json({token:token});
  }catch (error) {
    next(error);
  }
}

export const changePassword = async(req,res,next)=>{
  const {oldPassword,newPassword} = req.body;
  const id = req.user.id;
  try{
    if(oldPassword===newPassword){
      return res.status(200).json("Choose new password!");
    }
    await verifyUserCredentials(id, req.user.passwordChangedTime);
    const user = await User.findById(id);
    const validPassword = bcryptjs.compareSync(oldPassword, user.password);
    if (!validPassword) return next(errorHandler(401, 'wrong credentials'));
    const hashedPassword = bcryptjs.hashSync(newPassword, 10);
    user.password = hashedPassword;
    user.passwordChangedTime = new Date().toString();
    user.save();
    const token = jwt.sign(
      { id: req.user.id, passwordChangedTime: user.passwordChangedTime },
      process.env.JWT_SECRET,
      { expiresIn: TOKEN_EXPIRE_TIME } // Set expiration time in seconds
    );
    return res.status(201).json({token:token});
  }catch (error) {
    next(error);
  }
}

export const updateUser = async(req,res,next)=>{
  const { firstname,lastname,bio,profilePicture } = req.body; 
  const id = req.user.id;

  try {
    await verifyUserCredentials(id, req.user.passwordChangedTime);
    const user = await User.findById(id);
    if(user){
      user.profilePicture=profilePicture||user.profilePicture;
      user.firstname=firstname||user.firstname;
      user.lastname=lastname|| user.lastname;
      user.bio=bio||user.bio;
      await user.save();
      return res.status(201).json({ message: 'User updated successfully' });
    }
   return res.status(401).json({ message: 'No User detected' });
  } catch (error) {
    next(error);
  }
}


