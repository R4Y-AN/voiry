import React,{useEffect,useState} from 'react';
import '../customcss/Message.css';
import axios from 'axios';
import { useSelector } from 'react-redux';
import {Link,useNavigate} from 'react-router-dom';
import BeatLoader from "react-spinners/BeatLoader";
import VerifiedIcon from '@mui/icons-material/Verified';
import { toast } from 'react-hot-toast';

const ADMIN_USER_ID = process.env.REACT_APP_ADMIN_ID;

const UserProfileView = (props) => {
  const username = props.username;
  const [isLoading, setisLoading] = useState(true);
  const [otherProfile, setProfile] = useState(null);
  const [userAudioposts, setAudioPost] = useState(null);
  const user = useSelector((state) => state.data.user.user);
  const [followed, setfollowed] = useState(false);
  const navigate = useNavigate();
  const [like, setlike] = useState(0);
  const [followers, setfollowers] = useState(0);
  const [following, setfollowing] = useState(0);


  useEffect(() => {
    let isMounted = true;
  
    const fetchData = async () => {
      try {
        const response = await axios.post(process.env.REACT_APP_SERVER_IP + "api/user/info/" + username,{
          access_token:sessionStorage.getItem("_token")
        });
        if (response.status === 200 && isMounted) {
          setProfile(response.data.user);
          setfollowed(response.data.user.follower[0]=="true");
          setAudioPost(response.data.userAudioposts);
          const detailsResponse = await axios.post(process.env.REACT_APP_SERVER_IP+"api/user/details/"+response.data.user._id);
          setlike(detailsResponse.data.totalLikes);
          setfollowers(detailsResponse.data.followersCount);
          setfollowing(detailsResponse.data.followingCount);
        }

        

        setisLoading(false);
      } catch (err) {
       // setProfile(null);
        setProfile(null);
        setisLoading(false);
      }
    };
  
    fetchData();
  
    return () => {
      // Cleanup function
      isMounted = false;
      setisLoading(false);
    };
  }, [username]);
  
  

  const audioD = useSelector((state) => state.data.audio);
      useEffect(() => {
        if(window.location.pathname!=="/"){
          if(audioD&&audioD.currentAudioPlaying){
            audioD.currentAudioPlaying.current.pause();
          }
        }
        document.title = username+ ' • Voiry';
      }, []);


   const followUnfollowHandle = async() =>{
    try{
      const response = await axios.post(process.env.REACT_APP_SERVER_IP+"api/user/follow/"+otherProfile._id,{
        access_token:sessionStorage.getItem("_token")
      });
      if(response.status==200){
        if(response.data.followed){
          setfollowers(followers+1);
        }else{
          setfollowers(followers-1);
        }
        setfollowed(response.data.followed);
      }
    }catch{
     
    }
   }   
   useEffect(() => {
    if(!isLoading&&!otherProfile){
      toast("No Profile Found!");
      navigate('/');
    }
    if(otherProfile){
      props.setProfilePic(otherProfile.profilePicture);
      props.setReciverId(otherProfile._id);
    }
  }, [isLoading,otherProfile]);
  return (
    <div id='usr_prof' className='w-[600px] flex-col items-center h-screen pt-[100px] border-l flex'>
        {
          !isLoading&&!otherProfile&&<h1>No Profile Found!</h1>
        }
       {!isLoading&&otherProfile&&<><img src={otherProfile.profilePicture} className='w-[100px] h-[100px] rounded-full' alt="" />
       <h1 className='text-[21px] font-semibold'>{otherProfile.username}{ADMIN_USER_ID==otherProfile._id&&<VerifiedIcon className='text-[#1C96E9]'/>}</h1>
       <h1>{otherProfile.firstname||""}{" "}{otherProfile.lastname||""}</h1>
              <p className='mt-2 text-[15px] '>{otherProfile.bio||""}</p>
        <div className=' z-0  flex flex-row space-x-4 mt-[10px] items-center justify-center'>
              <div className='flex items-center justify-center flex-col'><span className='font-bold text-[16px]'>{followers}</span> <span className='text-[12px] hover:underline cursor-pointer'>Followers</span></div>
              <div className='flex items-center justify-center flex-col'><span className='font-bold text-[16px]'>{following}</span> <span className='text-[12px] hover:underline cursor-pointer'>Following</span></div>
              <div className='flex items-center justify-center flex-col'><span className='font-bold text-[16px]'>{like}</span> <span className='text-[12px] hover:underline cursor-pointer'>Likes</span></div>
           </div>
        {!followed&&<button onClick={followUnfollowHandle} className='border py-1 w-[90px] font-semibold rounded mt-[20px] text-[13px] text-[white] bg-[#4D918F]'>Follow</button>}
        {followed&&<button onClick={followUnfollowHandle} className='border py-1 w-[90px] font-semibold rounded mt-[20px] text-[13px]  border-[##4D918F] text-[#4D918F]'>Unfollow</button>}
        </> }
        {isLoading&& <BeatLoader color="#36d7b7" />}
    </div>
  )
}

export default UserProfileView