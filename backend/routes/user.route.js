import express from 'express';
import { followUser,getAudiosFromFollowing } from '../controllers/follow.controller.js';
import {
  deleteUser,
  otherProfile,
  user_social_details,
  info,
  refreshToken,
  updateUser,
  changePassword
} from '../controllers/user.controller.js';
import {sendMessage,recentlyChatUserList} from '../controllers/recentChats.controller.js';
import { post,findUserPosts,myFeed,likePost,searchPost,getPostById,deletePost,updatePost, itembytype,explorer, saveAudio, getSavedPosts } from '../controllers/post.controller.js';
import { verifyToken } from '../utils/verifyUser.js';


const router = express.Router();



// Routes For AudioPosting
router.post('/savePost',verifyToken,saveAudio);
router.post('/getsavedposts',verifyToken,getSavedPosts);
router.post('/post',verifyToken,post);
router.put('/post/:audioId',verifyToken,updatePost);
router.post('/audio/:audioId',getPostById);
router.post('/deletePost/:audioId',verifyToken,deletePost);
router.post('/getPost/:id',verifyToken,findUserPosts);
router.post('/myFeed2',myFeed);
router.post('/following/post',verifyToken,getAudiosFromFollowing);
router.post('/searchPost/:searchTitle',searchPost);
router.post('/likePost',verifyToken,likePost);


// Routes for exploerer
router.post('/tag/:type',itembytype);
router.post('/explorer',explorer);


// Routes For Messagings
router.post('/sendMessage',verifyToken,sendMessage);
router.post('/recentUsers',verifyToken,recentlyChatUserList);


// Routes For Follow Unfollow
router.post('/follow/:userId', verifyToken, followUser);

// Routes For User and OtherUser
router.post('/details/:userId',user_social_details);
router.post('/info/:id', otherProfile);
router.post('/info', verifyToken, info);
router.post('/refresh', verifyToken, refreshToken);
router.post('/update', verifyToken, updateUser);
router.post('/change-password', verifyToken, changePassword);
router.delete('/delete', verifyToken, deleteUser);


export default router;