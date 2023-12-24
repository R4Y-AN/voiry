import React from 'react'
import FavoriteIcon from '@mui/icons-material/Favorite';
import AudiotrackIcon from '@mui/icons-material/Audiotrack';
import HeadphonesIcon from '@mui/icons-material/Headphones';
import { useNavigate } from 'react-router-dom';
const ExplorerCard = (props) => {
  const navigate = useNavigate();
  const {tag,likes,audios,plays,path} = props;
  const handleClick = () =>{
    navigate(path);
  }
  return (
    <div className='w-[300px] h-[300px] mb-[35px] md:mr-[40px] shadow-md'>
        <div className='absolute w-[300px] cursor-pointer h-[300px] flex flex-row justify-center items-center'>
            <button className=' px-3 py-2 text-white rounded'>Show Audios</button>
        </div>
        <div className='absolute w-[300px] cursor-pointer h-[300px]'>
            <h1 className='text-[white] font-bold text-[30px] ml-[30px] mt-[40px]'>{tag}</h1>
            <div className='w-[300px] flex flex-row justify-start space-x-3 px-[30px]  mt-[170px]'>
            <h1 className='text-[white] font-bold text-[16px] flex flex-row items-center space-x-1'><AudiotrackIcon/> {audios}</h1>
            <h1 className='text-[white] font-bold text-[16px] flex flex-row items-center space-x-1'><FavoriteIcon></FavoriteIcon> {likes}</h1>
           
            </div>
        </div>
        <div className='absolute cursor-pointer w-[300px] h-[300px] bg-black rounded-md opacity-0 hover:opacity-70'  onClick={handleClick}></div>
        <img src={props.thumbnail} alt="" className='w-full h-full bg-cover rounded-md cursor-pointer '/>
    </div>
  )
}

export default ExplorerCard