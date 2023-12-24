import React,{useEffect, useState, } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector,useDispatch } from "react-redux";
import {Link} from 'react-router-dom';
import ChatUserCard from './ChatUserCard';
import axios from 'axios';

const RecentChatUsers = () => {
  const user = useSelector((state) => state.data.user.user);
  const [recentUsers, setrecentUsers] = useState([]);
  const [loading, setloading] = useState(true);
  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      try{
        const response = await axios.post(process.env.REACT_APP_SERVER_IP+"api/user/recentUsers",{
          access_token:sessionStorage.getItem("_token")
        });
        setrecentUsers(response.data.recentlyChatUsers);
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



  return (
    <div id='recent_usrs' className='w-full sm:w-[400px] h-screen pt-[100px]  overflow-hidden rounded-md items-center flex flex-col justify-center'>
        <div className='sm:w-[70%] w[80%]  h-[40px] rounded-full sm:ml-[75px]'><input type="text" placeholder='Search' className='outline-none px-2 text-[#B2B2B2] rounded-full w-full h-full '/></div>
        <div className="sm:w-[70%] w-full  h-full  flex flex-col mt-[30px] sm:ml-[75px] overflow-scroll space-y-[20px] scroll-smooth">
          {recentUsers&&recentUsers.length!=0&&recentUsers.map((items)=>
            <ChatUserCard data={items}></ChatUserCard>
          )}
          <div className='h-[50px]'></div>
        </div>
    </div>
  )
}

export default RecentChatUsers