import React,{useState,useEffect} from 'react'
import SearchIcon from '@mui/icons-material/Search'; 
import {Link,useNavigate} from 'react-router-dom';
import { useSelector,useDispatch } from "react-redux";
import {logoutUser} from "../features/userSlice";
import {sideBar} from "../features/sideBarSlice";
import { auth } from '../firebase';
import MessageIcon from '@mui/icons-material/Message';
const Navbar = () => {
  const user = useSelector((state) => state.data.user.user);
  const ShowsideBar = useSelector((state)=>state.data.sideBar.showSideBar);
  const [profileClicked, setprofileClicked] = useState(false);
  const dispatch = useDispatch(); 
  const navigate = useNavigate();
  const isLoading = useSelector((state) => state.data.user.isLoading);
  const [search, setsearch] = useState();
  const handleSearch = () =>{
    if(search&&search.trim()!=""){
      navigate('/search/'+search.trim());
    }else{
      navigate('/');
    }
  }
  const handleProfile=()=>{
    navigate('/profile');
  }
  const handleEditProfile=()=>{
    navigate('/profile/edit');
  }
  const handleLogout = () => {
    sessionStorage.clear();
    dispatch(logoutUser());
    window.location = '/';
  }
  const handleMessage=()=>{
    dispatch(sideBar(true));
    
    navigate('/message');
  }
  const handleSave=()=>{
    navigate('/mysavedposts');
  }
  useEffect(() => {
    if(window.location.pathname!="/message"&&!window.location.pathname.includes("/message/")){
      dispatch(sideBar(false));
      console.log(ShowsideBar);
    }else{
      dispatch(sideBar(true));
    }
    setprofileClicked(false);
  }, [window.location.pathname]); 
  return (
    <div className='z-[2000] shadow fixed w-full flex flex-row items-center justify-between px-4 py-2 border-b border-b-[#63E2C6] bg-white'>
        <div>
            <Link to='/' className=' cursor-pointer text-[30px] font-bold text-[#63E2C6]'>Voiry</Link>
        </div>
        <div className='hidden sm:block w-[40%] h-[40px] bg-[#FAFAFA] rounded-3xl'>
        <input onChange={(e)=>{setsearch(e.target.value)}} className='bg-[#FAFAFA] px-6 outline-none rounded-3xl w-[90%] h-[40px]'  placeholder='Search' type="text" />
        <SearchIcon onClick={handleSearch} className='text-[#42A672] cursor-pointer mt-[-2px] border-l w-[40px] pl-1 ml-[-4%]'></SearchIcon>
        </div>
       {!isLoading&& <div className='flex flex-row space-x-2'>
            <Link to='/upload' className='hidden sm:block rounded-md'><button className='hover:bg-[#4D918F] w-[100px] h-[40px] mr-2 border bg-[#5ABCB9] rounded-md text-[15px] font-semibold text-white'>Upload</button></Link>
            {!user?<Link to='/signin'><button className='hover:bg-[#FAFAFA] w-[100px] h-[40px] border text-[15px]  rounded-md font-semibold'>Sign In</button></Link>:
            <div className='flex flex-row space-x-3 items-center'>
              <MessageIcon onClick={handleMessage} style={{ fontSize: 32, color: '#63E2C6' }} className='cursor-pointer' />
            {/*profile pic*/}
              <img onClick={(e)=>{setprofileClicked(!profileClicked)}} src={user.profilePicture} className='w-[40px] h-[40px] rounded-full cursor-pointer' alt="" />
             {profileClicked &&<div className='absolute top-[62px] w-[150px] h-[280%] border rounded right-0 bg-white flex flex-col '>
                    <button onClick={handleProfile} className='w-full py-2  hover:bg-[#63E2C6]'>Profile</button>
                    <button onClick={handleEditProfile} className='w-full py-2  hover:bg-[#63E2C6]'>Edit Profile</button>
                    <button onClick={handleSave} className='w-full py-2  hover:bg-[#63E2C6]'>Saved Audios</button>
                    <button onClick={handleLogout} className='w-full py-2  hover:bg-[#63E2C6]'>Logout</button>
              </div>}
            </div>}
        </div>}
    </div>
  )
}//<button onClick={handleLogout} className='hover:bg-[#FAFAFA] w-[100px] h-[40px] border text-[15px]  rounded-md font-semibold'>Logout</button>

export default Navbar;