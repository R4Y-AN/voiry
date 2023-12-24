import React,{useState,useRef,useEffect} from 'react'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { useSelector,useDispatch } from "react-redux";
import { playAudio } from "../features/playSlice";
import {Link} from 'react-router-dom';
import toast from 'react-hot-toast';
import FavoriteIcon from '@mui/icons-material/Favorite';
import axios from 'axios';
import PauseIcon from '@mui/icons-material/Pause';
import VerifiedIcon from '@mui/icons-material/Verified';
import {setSavedAudios} from '../features/userSlice';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';

const ADMIN_USER_ID = process.env.REACT_APP_ADMIN_ID;

const NewCard = (props) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioPlayedPercent, setAudioPlayedPercent] = useState(1);
  const [audDuration, setDuration] = useState(1);
  const audioRef = useRef(new Audio(props.audioFile));
  const audioD = useSelector((state) => state.data.audio.audio);
  const currentAudioId = useSelector((state) => state.data.audio.currentAudioId);
  const [likes,isLiked] = useState(false);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.data.user.user);
  const [totalLikes, settotalLikes] = useState(props.likes.length);
  const [saved, setsaved] = useState(false);

  useEffect(() => {
     if(user&&sessionStorage.getItem("_token")){
        if(props.likes.includes(user.id)){
          isLiked(true);
        }else{
          isLiked(false);
        }
        setsaved(user.savedAudios.includes(props.id))
     }
  }, [props.likes,user]);

  const handlePlayPause = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }

    setIsPlaying(!isPlaying);
    dispatch(playAudio({ id: props.id ,audioPlayer:audioRef}));
  };

  const updateAudioProgress = () => {
    const percent = (audioRef.current.currentTime / audioRef.current.duration) * 100;
    setAudioPlayedPercent(percent);
  };

  const handleLoadedMetadata = () => {
    setDuration(audioRef.current.duration);
  };

  useEffect(() => {
    // ... (other useEffect code)

    audioRef.current.addEventListener('loadedmetadata', handleLoadedMetadata);

    return () => {
      audioRef.current.removeEventListener('timeupdate', updateAudioProgress);
      audioRef.current.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  }, [currentAudioId, props.id]);

  useEffect(() => {
    if (props.id === currentAudioId) {
      setIsPlaying(audioRef.current.paused ? false : true);
      audioRef.current.addEventListener('timeupdate', updateAudioProgress);
    } else {
      audioRef.current.pause();
      setIsPlaying(false);
      audioRef.current.removeEventListener('timeupdate', updateAudioProgress);
      setAudioPlayedPercent(0);
    }

    // Clean up event listener on component unmount
    return () => {
      audioRef.current.removeEventListener('timeupdate', updateAudioProgress);
    };
  }, [currentAudioId, props.id]);

  function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    const formattedTime = `${padZero(minutes)}:${padZero(remainingSeconds)}`;
    return formattedTime;
  }

  function padZero(value) {
    return value < 10 ? `0${value}` : value;
  }

  const handleFav = async() => {
    if (!sessionStorage.getItem('_token') || !user) {
      toast('You have to logged in!');
      return;
    }
    try {
      const response = await axios.post(process.env.REACT_APP_SERVER_IP+"api/user/likePost",{
        postId:props.id,
        access_token:sessionStorage.getItem('_token')
      });
      if(response.status==200){
          if(likes){
            settotalLikes(totalLikes-1);
          }else{
            settotalLikes(totalLikes+1);
          }
          isLiked(!likes);
      }
    } catch(err) {
      console.log(err);
    }
  };


  // complete the function handleSave here savedAudios is the array where each element is the id of the audio if the saved Audios contains the current audioId then it should
  // change the saved to true
  // and the handle save should request to backend and if backend response 200 thats mean it is saved if it it is already saved then it should unsave it and i have developed the backend well
  
 

  
  const handleSave = async () => {
    if (!sessionStorage.getItem('_token') || !user) {
      toast('You have to be logged in!');
      return;
    }
  
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_SERVER_IP}api/user/savePost`,
        {
          audioId: props.id,
          access_token: sessionStorage.getItem('_token')
        }
      );
  
      if (response.status === 200) {
        // Assuming the backend response includes a 'saved' property indicating the current state
        const { saved } = response.data;
  
        // Update the local state based on the backend response
        setsaved(saved);

        // printing the saved value
        console.log(saved);

        // Update savedAudios in the Redux state based on the backend response
        const updatedSavedAudios = saved
          ? [...user.savedAudios, props.id] // Add the audio ID to savedAudios if saved
          : user.savedAudios.filter(audioId => audioId !== props.id); // Remove the audio ID if unsaved
  
        // Dispatch an action to update savedAudios in the Redux state
        // You need to implement the corresponding action in your Redux slice
        dispatch(setSavedAudios(updatedSavedAudios));
      }
    } catch (err) {
      console.log(err);
    }
  };
  
  return (
    <div class="mt-6 sm:mt-10 transition-all duration-500 relative z-10 rounded-xl shadow-xl w-[90%]  sm:h-full sm:w-[300px]  lg:w-[350px]">
    <div
        class="w-full bg-white transition-all duration-500 border-slate-100 dark:bg-slate-800  dark:border-slate-500 border-b rounded-t-xl pb-6 space-y-6">
        <div class="flex items-start flex-col ">
            <img src={props.thumbnail} loading="lazy" decoding="async" alt="" class="flex-none  bg-slate-100 w-full h-[200px]" height="88"/>
            <div class="w-full px-2 transition-all duration-500 flex-auto space-y-1 font-semibold">
                <h2 class="text-slate-500  dark:text-slate-400 text-sm leading-6 truncate">
                    {props.shortDesc}
                </h2>
                <p class="text-slate-900  dark:text-slate-50 text-lg">
                    {props.title}
                </p>
                <div className='text-end cursor-pointer'>
                <Link to={'/'+props.author} className='text-[15px] text-[#646464]'>{props.author}{props.userId==ADMIN_USER_ID&&<VerifiedIcon className='text-[#1C96E9]'/>}</Link>
                </div>
            </div>
        </div>
        <div class="space-y-2  px-2">
            <div class="relative">
              {/* Slider */}
                <div class="bg-slate-100 transition-all  duration-500 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div style={{width:(audioPlayedPercent)+"%"}} class={`bg-cyan-500  transition-all duration-500 dark:bg-cyan-400 h-2 `} role="progressbar"
                        aria-label="music progress" aria-valuenow="1456" aria-valuemin="0" aria-valuemax="4550"></div>
                </div>
                <div style={{left:(audioPlayedPercent)+"%"}}
                    class="ring-cyan-500 transition-all  duration-500 dark:ring-cyan-400 ring-2 absolute  top-1/2 w-4 h-4 -mt-2 -ml-0 flex items-center justify-center bg-white rounded-full shadow">
                    <div
                        class="w-1.5 h-1.5  bg-cyan-500 transition-all duration-500 dark:bg-cyan-400 rounded-full ring-1 ring-inset ring-slate-900/5">
                    </div>
                </div>
            </div>
            <div class="flex justify-between transition-all duration-500 text-sm leading-6 font-medium tabular-nums">
                <div class="text-cyan-500  dark:text-slate-100">{formatTime(audioRef.current.currentTime)}</div>
                <div class="text-slate-500  dark:text-slate-400">{formatTime(audioRef.current.duration)}</div>
            </div>
            <div className="w-full text-[17px] font-semibold text-[#6474A8] h-full text-end ">
               <span className='text-[black]'>{totalLikes+" "}</span> Likes
            </div>
        </div>
    </div>
    <div
        class="bg-slate-50 mt-[-20px] w-full text-slate-500  dark:bg-slate-600  dark:text-slate-200 rounded-b-xl flex items-center">
        <div class=" flex-auto flex items-center justify-evenly">
            <button onClick={handleSave}  type="button" aria-label="Add to favorites">
            {!saved&&<BookmarkBorderIcon/>}
    {saved&&<BookmarkIcon/>}
    </button>
  
        </div>
        <button onClick={handlePlayPause} type="button" class="bg-white text-slate-900  dark:bg-slate-100  dark:text-slate-700 flex-none -my-2 mx-auto w-20 h-20 rounded-full ring-1 ring-slate-900/5 shadow-md flex items-center justify-center" aria-label="Pause">
        {/*Play*/}
       {!isPlaying&& <svg className='ml-2' width="30" height="32" viewBox="0 0 213 266" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M208.992 126.144L13.9252 1.64417C11.2032 -0.0822298 7.69198 -0.273126 4.78371 1.16277C1.88431 2.59867 0.0666504 5.42067 0.0666504 8.49997V257.5C0.0666504 260.579 1.88433 263.401 4.79259 264.837C6.08713 265.485 7.51465 265.8 8.93332 265.8C10.6801 265.8 12.4268 265.31 13.9252 264.356L208.992 139.856C211.413 138.312 212.867 135.747 212.867 133C212.867 130.253 211.413 127.688 208.992 126.144ZM17.8 241.788V24.2119L188.262 133L17.8 241.788Z" fill="black"/>
</svg>}
{
  isPlaying&&<PauseIcon></PauseIcon>
}
  </button>
        <div class="flex-auto flex items-center justify-evenly">
         
           {/*  <button type="button" class="rounded-lg text-xs leading-6 font-semibold px-2 ring-2 ring-inset ring-slate-500 text-slate-500 transition-all duration-500 dark:text-slate-100 transition-all duration-500 dark:ring-0 transition-all duration-500 dark:bg-slate-500">
      1x
    </button> */}
    <button type="button" onClick={handleFav} class="">
    {!likes&&<FavoriteBorderIcon></FavoriteBorderIcon>}
    {likes&&<FavoriteIcon></FavoriteIcon>}
    </button>
        </div>
    </div>
</div>
  )
}

export default NewCard