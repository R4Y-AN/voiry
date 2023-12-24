import React,{useEffect, useState, } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector,useDispatch } from "react-redux";
import {Link} from 'react-router-dom';
import { logoutUser } from '../features/userSlice';
import axios from 'axios';
import BeatLoader from "react-spinners/BeatLoader";
import ProfileContentCard from '../components/ProfileContentCard';
import VerifiedIcon from '@mui/icons-material/Verified';

const Profile = () => {
const user = useSelector((state) => state.data.user.user);
const navigate = useNavigate();
const isLoading = useSelector((state) => state.data.user.isLoading);
const dispatch = useDispatch();
const audioD = useSelector((state) => state.data.audio);
const [like, setlike] = useState(0);
const [followers, setfollowers] = useState(0);
const [following, setfollowing] = useState(0);
const [loading, setloading] = useState(true);

useEffect(() => {
    if(!isLoading&&!user){
      navigate('/signin');
    }
}, [isLoading,user]);

    useEffect(() => {
      if(window.location.pathname!=="/"){
        if(audioD&&audioD.currentAudioPlaying){
          audioD.currentAudioPlaying.current.pause();
        }
      }
      document.title = 'Profile • Voiry';

    }, []);

    useEffect(() => {
      let isMounted = true;
      setloading(true);
      const fetchData = async () => {
        setloading(true);
        try{
          const response = await axios.post(process.env.REACT_APP_SERVER_IP+"api/user/details/"+user.id);
          setlike(response.data.totalLikes);
          setfollowers(response.data.followersCount);
          setfollowing(response.data.followingCount);
          setloading(false);
        }catch(err){
          setloading(false);
        }
      };
    
      fetchData();
    
      return () => {
        // Cleanup function
        setloading(false);
        isMounted = false;
      };
    }, [user]);

const handleLogout = () => {
  sessionStorage.clear();
  dispatch(logoutUser());
  window.location = '/';
}
return (
    <div className='w-full z-0 h-full flex items-center flex-col '>
        {user&&!isLoading&&!loading&&<div className='  z-0   overflow-x-hidden overflow-y-hidden items-center absolute top-[100px] overflow-scroll flex flex-col justify-center '> 
        <div className=' z-0 h-full flex w-full  flex-row  justify-center items-center space-x-2'>
                  <img className='w-[120px] h-[120px] rounded-full bg-white border cursor-pointer' src={user.profilePicture} alt="" />
                  <div className='flex flex-col'>
                  <h1 className='font-bold  sm:text-[23px] flex flex-row items-center'>{user.username}{user.email=="dev.rferdous@gmail.com"&&<VerifiedIcon className='text-[#1C96E9]'/>}</h1>
                  <h1 className='font-semibold sm:text-[20px]'>{(user.firstname||"")+" "+(user.lastname||"")}</h1>
                  </div>
            </div>
            <div className=' z-0 mt-[30px] flex flex-row space-x-2'>
              <div><span className='font-bold text-[20px]'>{followers}</span> <span className='hover:underline cursor-pointer'>Followers</span></div>
              <div><span className='font-bold text-[20px]'>{following}</span> <span className='hover:underline cursor-pointer'>Following</span></div>
              <div><span className='font-bold text-[20px]'>{like}</span> <span className='hover:underline cursor-pointer'>Likes</span></div>
            </div>
          <div className='flex mt-[30px] flex-row w-full items-center justify-center space-x-3'>
          <Link to='/profile/edit'><button className='border py-2 px-3 rounded'>Edit Profile</button></Link> 
          </div>
        
        
        
        
        
        
        
        
        
        
        
           <div className='h-[20px]'></div>

<div className='px-[20px] sm:px-[60px] md:px-[220px] ml-[0px] md:ml-[30px] mt-[40px] h-full flex flex-row flex-wrap items-center justify-center'>
{
  user.userAudioposts&&user.userAudioposts.length==0&&<h1 className='text-black mt-[-60px] sm:ml-[-30px] font-bold text-[15px]'>No Audio Post!</h1>
 }
 {
   user.userAudioposts.map((item) => (
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
        
        
        
        
        
        
        
        
        
        </div>}
        {loading&&   <div className='z-[10] items-center flex-wrap justify-center lg:flex-nowrap w-full flex flex-row overflow-x-hidden overflow-y-hidden absolute top-[100px]    '>
                
                <BeatLoader color="#36d7b7" />
                </div>}



    </div>
   )
}

export default Profile