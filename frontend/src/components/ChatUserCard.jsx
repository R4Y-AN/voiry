import React from 'react';
import { useNavigate } from 'react-router-dom';

const ChatUserCard=(props)=>{
    const {profilePicture,username,message,timestamp} = props.data;

    const navigate = useNavigate();

    const formatTimeAgo = (timestamp) => {
        const now = new Date();
        const seconds = Math.floor((now - timestamp) / 1000);
    
        // Define time intervals in seconds
        const intervals = {
            year: 31536000,
            month: 2592000,
            week: 604800,
            day: 86400,
            hour: 3600,
            minute: 60,
        };
    
        for (const [interval, secondsInInterval] of Object.entries(intervals)) {
            const numberOfIntervals = Math.floor(seconds / secondsInInterval);
    
            if (numberOfIntervals >= 1) {
                return `${numberOfIntervals} ${interval}${numberOfIntervals > 1 ? 's' : ''} ago`;
            }
        }
    
        return 'Just now';
    }
    const handleClick=()=>{
        navigate('/message/'+username);
    }
    return (
        <div onClick={handleClick} className='w-full flex flex-row h-[70px] sm:pl-0 pl-10 space-x-1 cursor-pointer py-2'>
            <img src={profilePicture} className='rounded-full w-[40px] h-[40px]' alt="" />
            <div className='flex flex-col '>
                <div className='flex flex-row space-x-8'>
                <h1 className='text-[#777777] text-semibold'>{username}</h1>
                <h1 className='text-[#B1B6BD]'>{formatTimeAgo(timestamp)}</h1>
                </div>
                <h1 className='text-[#B1B6BD]'>{message}</h1>
            </div>
        </div>
    )
}
export default ChatUserCard;