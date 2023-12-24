import React,{useEffect,useState} from 'react'
import RecentChatUsers from '../components/RecentChatUsers'
import UserProfileView from '../components/UserProfileView'
import ChatBox from '../components/ChatBox'
import { useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom'
import { Route, Routes,useParams } from 'react-router-dom';
import { getDatabase, ref, onValue } from 'firebase/database';
import { db } from '../firebase';
import axios from 'axios';
import {toast} from 'react-hot-toast';

const MessagePage = () => {
    const user = useSelector((state) => state.data.user.user);
    const navigate = useNavigate();
    const isLoading = useSelector((state) => state.data.user.isLoading);
    
    const [profilePic, setProfilePic] = useState("");
    const [receiverId, setReciverId] = useState("");
    const {username} = useParams();


      

      useEffect(() => {
        if (!isLoading&&!user) {
          navigate('/signin');
        }
      }, [user, isLoading]);

      useEffect(() => {
        if (username===user.username) {
          toast("You cannot message yourself!");
          navigate('/');
        }
      }, []);

      const audioD = useSelector((state) => state.data.audio);
      useEffect(() => {
        if(window.location.pathname!=="/"){
          if(audioD&&audioD.currentAudioPlaying){
            audioD.currentAudioPlaying.current.pause();
          }
        }
        document.title = 'Inbox • Voiry';
      }, []);

  return (
    <div className='w-full h-screen  flex justify-between  flex-row'>
      {username&&<div className='hidden sm:block'><RecentChatUsers></RecentChatUsers></div>}
      {!username&&<RecentChatUsers></RecentChatUsers>}
      {username&&<ChatBox chatSelected={true} profilePic={profilePic} receiverId={receiverId}></ChatBox>}
      {!username&&<ChatBox chatSelected={false}></ChatBox>}
      {username&&<UserProfileView setProfilePic={setProfilePic} setReciverId={setReciverId} username={username}/>}
    </div>
  )
}

export default MessagePage