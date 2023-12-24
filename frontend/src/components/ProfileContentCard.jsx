import React from 'react'
import test from '../assets/test.jpg';
import FavoriteIcon from '@mui/icons-material/Favorite';
import {useNavigate} from 'react-router-dom';

const ProfileContentCard = (props) => {
  let {thumbnail,title,shortDesc,likes} = props;
  shortDesc=shortDesc.length>=20?shortDesc.substring(0,20)+"...":shortDesc;
  const navigate = useNavigate();
  const handleClick=()=>{ 
    navigate('/audio/'+props.id);
  };
  return (
    <div className='w-[200px] h-[200px] border rounded-md mr-[15px] mb-[20px] shadow-lg z-0'>
    <div className='w-[200px] h-full absolute flex  flex-row px-3 cursor-pointer' onClick={handleClick}>
       <div className='w-full h-full mt-[140px]'>
           <h1 className='text-white text-[15px]'>{title}</h1>
           <h1 className='text-white text-[12px]'>{shortDesc}</h1>
       </div>
       <div className='flex flex-col text-white items-center mt-[140px]'>
          <FavoriteIcon></FavoriteIcon>
          <h1>{likes}</h1>
       </div>
    </div>
    <img src={thumbnail} alt="" className='w-full h-full bg-cover rounded-md'/>
    </div>
  )
}

export default ProfileContentCard