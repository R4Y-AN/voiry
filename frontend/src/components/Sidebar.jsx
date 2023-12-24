import React,{useEffect} from 'react'
import HomeIcon from '@mui/icons-material/Home';
import GroupIcon from '@mui/icons-material/Group';
import ExploreIcon from '@mui/icons-material/Explore';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import {Link,useLocation} from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import { useSelector } from "react-redux";
const Sidebar = () => {
    const user = useSelector((state) => state.data.user.user);
    const location = useLocation();
    const isLoading = useSelector((state) => state.data.user.isLoading);
    const showSideBar = useSelector((state)=>state.data.sideBar.showSideBar);

    const getTextColor=(id)=>{
        if((id=="foryou"&&location.pathname=='/')||(id==location.pathname.substring(1))){
            return "white";
        }else{
            return "black";
        }
    }
    const getBgColor=(id)=>{
        if((id=="foryou"&&location.pathname=='/')||(id==location.pathname.substring(1))){
            return "#63E2C6";
        }else{
            return "#fff";
        }
    }

  return (
    <div className='w-full h-full' >
        {!showSideBar&&<><div className='top-[80px] z-[1000]  fixed w-[230px] h-[50px] hidden md:block'>
            <ul className='text-[20px] z-[1000] font-semibold space-y-2 w-full h-[50px]'>
                <Link to='/' id='foryou' className={"pl-[15px] cursor-pointer hover:bg-[#63E2C6] hover:text-white w-full h-[50px] flex flex-row items-center bg-["+getBgColor("foryou")+"] text-"+getTextColor("foryou")+" "}><HomeIcon className='mr-[10px] '></HomeIcon> For You</Link>
                <Link to='/following' id='following' className={"pl-[15px] cursor-pointer hover:bg-[#63E2C6] hover:text-white w-full h-[50px] flex flex-row items-center bg-["+getBgColor("following")+"] text-"+getTextColor("following")+" "}><GroupIcon className='mr-[10px] '></GroupIcon> Following</Link>
             {/*    <Link to='/contest' id='contest' className={"pl-[15px] cursor-pointer hover:bg-[#63E2C6] hover:text-white w-full h-[50px] flex flex-row items-center bg-["+getBgColor("contest")+"] text-"+getTextColor("contest")+" "}><EmojiEventsIcon className='mr-[10px] '></EmojiEventsIcon> Contest</Link> */}
                <Link to='/explorer' id='explorer' className={"pl-[15px] cursor-pointer hover:bg-[#63E2C6] hover:text-white w-full h-[50px] flex flex-row items-center bg-["+getBgColor("explorer")+"] text-"+getTextColor("explorer")+" "}><ExploreIcon className='mr-[10px] '></ExploreIcon> Explorer</Link>
                <Link to='/profile' id='profile' className={"pl-[15px] cursor-pointer hover:bg-[#63E2C6] hover:text-white w-full h-[50px] flex flex-row items-center bg-["+getBgColor("profile")+"] text-"+getTextColor("profile")+" "}><AccountCircleIcon className='mr-[10px] '></AccountCircleIcon> Profile</Link>
                {!isLoading&&!user&&<><p className='pl-[15px] text-[17px] text-[#9C9DA2] border-t border-t-[#c4c5c7] pt-2'>Sign Up to follow, like videos and view comments.</p>
                <div className='w-[250px] flex flex-row justify-center'>
                <Link to='/signup'><button className='hover:bg-[#63E2C6] hover:text-white w-[220px] m-auto h-[50px] border text-[18px] border-[#63E2C6] text-[#63E2C6] rounded-md font-semibold'>Sign Up</button></Link>
                </div></>}
            </ul>
        </div>
        <div className={'pt-[100px] bg-white z-[1000] fixed w-[60px] h-full  border-r hidden md:hidden sm:block'}>
            <ul className='text-[20px] z-[1000]  font-semibold space-y-3 w-full h-[50px] '>
                <Link to='/'            id='foryou' className={"pl-[15px] cursor-pointer hover:bg-[#63E2C6] hover:text-white w-full h-[50px] flex flex-row items-center bg-["+getBgColor("foryou")+"] text-"+getTextColor("foryou")+" "}><HomeIcon className='mr-[10px] '></HomeIcon></Link>
                <Link to='/following'   id='following' className={"pl-[15px] cursor-pointer hover:bg-[#63E2C6] hover:text-white w-full h-[50px] flex flex-row items-center bg-["+getBgColor("following")+"] text-"+getTextColor("following")+" "}><GroupIcon className='mr-[10px] '></GroupIcon></Link>
{/*                 <Link to='/contest'   id='contest' className={"pl-[15px] cursor-pointer hover:bg-[#63E2C6] hover:text-white w-full h-[50px] flex flex-row items-center bg-["+getBgColor("contest")+"] text-"+getTextColor("contest")+" "}><EmojiEventsIcon className='mr-[10px] '></EmojiEventsIcon></Link> */}
                <Link to='/explorer'    id='explorer' className={"pl-[15px] cursor-pointer hover:bg-[#63E2C6] hover:text-white w-full h-[50px] flex flex-row items-center bg-["+getBgColor("explorer")+"] text-"+getTextColor("explorer")+" "}><ExploreIcon className='mr-[10px]' ></ExploreIcon></Link>
                <Link to='/profile'     id='profile' className={"pl-[15px] cursor-pointer hover:bg-[#63E2C6] hover:text-white w-full h-[50px] flex flex-row items-center bg-["+getBgColor("profile")+"] text-"+getTextColor("profile")+" "}><AccountCircleIcon className='mr-[10px]'></AccountCircleIcon></Link>
            </ul>
        </div>
        <div className='z-[200] bottom-[0px] fixed w-full flex items-center flex-row justify-center sm:hidden'>
            <div className='text-[20px] font-semibold  w-full items-center justify-center flex flex-row space-x-[2px] bg-[#63E2C6] rounded shadow-md'>
                <Link to='/' id='foryou' className={"w-[40px] text-center rounded h-[40px] cursor-pointer list-none bg-["+getBgColor("foryou")+"] text-"+getTextColor("foryou")+" "}><HomeIcon></HomeIcon></Link>
                <Link to='/following'  id='following' className={"w-[40px] text-center rounded h-[40px] cursor-pointer list-none bg-["+getBgColor("following")+"] text-"+getTextColor("following")+" "}><GroupIcon></GroupIcon></Link>
                <Link to='/upload' id='upload' className={"w-[40px] text-center rounded h-[40px] cursor-pointer list-none  bg-[#5ABCB9] shadow-sm  text-"+getTextColor("upload")+""}><AddIcon></AddIcon></Link>
                <Link to='/contest'  id='contest' className={"w-[40px] text-center rounded h-[40px] cursor-pointer list-none bg-["+getBgColor("contest")+"] text-"+getTextColor("contest")+" "}><EmojiEventsIcon></EmojiEventsIcon></Link>
                <Link to='/explorer' id='explorer' className={"w-[40px] text-center rounded h-[40px] cursor-pointer list-none bg-["+getBgColor("explorer")+"] text-"+getTextColor("explorer")+" "}><ExploreIcon></ExploreIcon></Link>
            </div>
        </div></>}
        {showSideBar&&<>
        <div className={'pt-[100px] bg-white z-[1000] fixed w-[60px] h-full  border-r hidden sm:block'}>
             <ul className='text-[20px] z-[1000]  font-semibold space-y-3 w-full h-[50px] '>
                 <Link to='/'            id='foryou' className={"pl-[15px] cursor-pointer hover:bg-[#63E2C6] hover:text-white w-full h-[50px] flex flex-row items-center bg-["+getBgColor("foryou")+"] text-"+getTextColor("foryou")+" "}><HomeIcon className='mr-[10px] '></HomeIcon></Link>
                 <Link to='/following'   id='following' className={"pl-[15px] cursor-pointer hover:bg-[#63E2C6] hover:text-white w-full h-[50px] flex flex-row items-center bg-["+getBgColor("following")+"] text-"+getTextColor("following")+" "}><GroupIcon className='mr-[10px] '></GroupIcon></Link>
                 {/* <Link to='/contest'   id='contest' className={"pl-[15px] cursor-pointer hover:bg-[#63E2C6] hover:text-white w-full h-[50px] flex flex-row items-center bg-["+getBgColor("contest")+"] text-"+getTextColor("contest")+" "}><EmojiEventsIcon className='mr-[10px] '></EmojiEventsIcon></Link> */}
                 <Link to='/explorer'    id='explorer' className={"pl-[15px] cursor-pointer hover:bg-[#63E2C6] hover:text-white w-full h-[50px] flex flex-row items-center bg-["+getBgColor("explorer")+"] text-"+getTextColor("explorer")+" "}><ExploreIcon className='mr-[10px]' ></ExploreIcon></Link>
                 <Link to='/profile'     id='profile' className={"pl-[15px] cursor-pointer hover:bg-[#63E2C6] hover:text-white w-full h-[50px] flex flex-row items-center bg-["+getBgColor("profile")+"] text-"+getTextColor("profile")+" "}><AccountCircleIcon className='mr-[10px]'></AccountCircleIcon></Link>
             </ul>
         </div>
          <div className='z-[200] bottom-[0px] fixed w-full flex items-center flex-row justify-center sm:hidden'>
          <div className='text-[20px] font-semibold  w-full items-center justify-center flex flex-row space-x-[2px] bg-[#63E2C6] rounded shadow-md'>
              <Link to='/' id='foryou' className={"w-[40px] text-center rounded h-[40px] cursor-pointer list-none bg-["+getBgColor("foryou")+"] text-"+getTextColor("foryou")+" "}><HomeIcon></HomeIcon></Link>
              <Link to='/following'  id='following' className={"w-[40px] text-center rounded h-[40px] cursor-pointer list-none bg-["+getBgColor("following")+"] text-"+getTextColor("following")+" "}><GroupIcon></GroupIcon></Link>
              <Link to='/upload' id='upload' className={"w-[40px] text-center rounded h-[40px] cursor-pointer list-none  bg-[#5ABCB9] shadow-sm  text-"+getTextColor("upload")+""}><AddIcon></AddIcon></Link>
              <Link to='/contest'  id='contest' className={"w-[40px] text-center rounded h-[40px] cursor-pointer list-none bg-["+getBgColor("contest")+"] text-"+getTextColor("contest")+" "}><EmojiEventsIcon></EmojiEventsIcon></Link>
              <Link to='/explorer' id='explorer' className={"w-[40px] text-center rounded h-[40px] cursor-pointer list-none bg-["+getBgColor("explorer")+"] text-"+getTextColor("explorer")+" "}><ExploreIcon></ExploreIcon></Link>
          </div>
      </div></>
        }
    </div>
  )
}

export default Sidebar

//bg-["+getBgColor("upload")+"] text-"+getTextColor("upload")+"