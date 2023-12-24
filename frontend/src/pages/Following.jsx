import React,{useEffect} from 'react'
import { useNavigate } from 'react-router-dom'
import CardView from '../components/CardView';
import { useSelector } from "react-redux";

const Following = () => {
    const user = useSelector((state) => state.data.user.user);
    const navigate = useNavigate();
    const isLoading = useSelector((state) => state.data.user.isLoading);
      useEffect(() => {
        if (!isLoading&&!user) {
          navigate('/signin');
        }
      }, [user, isLoading]);

      const audioD = useSelector((state) => state.data.audio);
      useEffect(() => {
        if(window.location.pathname!=="/"){
          if(audioD&&audioD.currentAudioPlaying){
            audioD.currentAudioPlaying.current.pause();
          }
        }
        document.title = 'Following • Voiry';
      }, []);
return (
    <CardView link="api/user/following/post"></CardView>
   )
}

export default Following