import React,{useEffect} from 'react'
import { useSelector } from 'react-redux';
const Contest = () => {
  const audioD = useSelector((state) => state.data.audio);
  useEffect(() => {
        if(window.location.pathname!=="/"){
          if(audioD&&audioD.currentAudioPlaying){
           audioD.currentAudioPlaying.current.pause();
          }
        }
        document.title = 'Contest • Voiry';
   }, []);
      
return (
    <div className='w-full h-full flex items-center flex-col '>
        <div className='z-[10] overflow-x-hidden overflow-y-hidden items-center absolute top-[100px] overflow-scroll flex flex-col space-y-9 '> 
            Contest
        </div>
    </div>
   )

}

export default Contest