import React,{useEffect,useState} from 'react'
import axios from 'axios';
import { useSelector } from 'react-redux';
import {Link,useNavigate} from 'react-router-dom';
import ProfileContentCard from '../components/ProfileContentCard';
import BeatLoader from "react-spinners/BeatLoader";
import VerifiedIcon from '@mui/icons-material/Verified';

const ADMIN_USER_ID = process.env.REACT_APP_ADMIN_ID;

const OthersProfile = () => {
  const username = window.location.pathname.substring(1);
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

  const handleMessage=()=>{
    navigate("/message/"+username);
  }    
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
  
  return (
    <div className='w-full h-full flex items-center flex-col justify-center'>
      <div className='z-[10] overflow-x-hidden overflow-y-hidden items-center absolute top-[100px] overflow-scroll flex flex-col space-y-9 '> 
        {
          !isLoading&&!otherProfile&&<h1>No Profile Found!</h1>
        }
        {!isLoading&&otherProfile&&
          <><div className='flex flex-col w-full h-full items-center justify-center'>
              <img src={otherProfile.profilePicture} alt="" className='rounded-full w-[160px] h-[160px]' />
              <h1 className='text-[25px] font-semibold'>{otherProfile.username}{ADMIN_USER_ID==otherProfile._id&&<VerifiedIcon className='text-[#1C96E9]'/>}</h1>
              <h1>{otherProfile.firstname+" "||""} {otherProfile.lastname||""}</h1>
              <p className='mt-2 text-[15px] '>{otherProfile.bio||""}</p>
            <div className=' z-0  flex flex-row space-x-2 mt-[10px]'>
              <div><span className='font-bold text-[20px]'>{followers}</span> <span className='hover:underline cursor-pointer'>Followers</span></div>
              <div><span className='font-bold text-[20px]'>{following}</span> <span className='hover:underline cursor-pointer'>Following</span></div>
              <div><span className='font-bold text-[20px]'>{like}</span> <span className='hover:underline cursor-pointer'>Likes</span></div>
           </div>
          {/* follow unfollow */}
         {<div className='flex flex-row space-x-4 mt-[10px]'>
          {!followed?<button onClick={followUnfollowHandle} className='border py-2 w-[100px] font-semibold rounded mt-[20px] text-[white] bg-[#4D918F]'>Follow</button>:
          <button onClick={followUnfollowHandle} className='py-2 w-[100px] rounded mt-[20px] font-semibold text-[#4D918F] border border-[#4D918F]'>Unfollow</button> }
          {user&&sessionStorage.getItem("_token")&&user.id!=otherProfile._id&&<button onClick={handleMessage} className='border py-2 w-[100px] font-semibold rounded mt-[20px] text-[white] bg-[#4D918F]'>Message</button>}</div>}
          </div>

          <div className='h-[20px]'></div>

          <div className='z-0 px-[20px] sm:px-[60px] md:px-[220px] ml-[0px] md:ml-[30px] h-full flex flex-row flex-wrap items-center justify-center'>
          {
  userAudioposts&&userAudioposts.length==0&&<h1 className='text-black mt-[-60px] sm:ml-[-30px] font-bold text-[15px]'>No Audio Post!</h1>
 }
          {

            
   userAudioposts&&userAudioposts.map((item) => (
   <ProfileContentCard
      key={item._id}
      id={item._id}
      title={item.title}
      shortDesc={item.shortDesc}
      likes={item.likes.length}
      thumbnail={item.thumbnail}
   ></ProfileContentCard>
   ))
 }
 
           
          </div>

          <div className='h-[50px]'></div>

            </>
          }
      </div>
      {isLoading&&   <div className='z-[10] items-center flex-wrap justify-center lg:flex-nowrap w-full flex flex-row overflow-x-hidden overflow-y-hidden absolute top-[100px]    '>
                
                <BeatLoader color="#36d7b7" />
                </div>}
    </div>
  )
}

export default OthersProfile