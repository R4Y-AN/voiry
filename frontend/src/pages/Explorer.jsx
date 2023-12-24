import React,{useEffect,useState} from 'react'
import ExplorerCard from '../components/ExplorerCard';
import Horror from '../assets/horror.jpg';
import Story from '../assets/Story.jpg';
import song from '../assets/song.jpg';
import funny from '../assets/funny.jpg';
import bedtimestory from '../assets/bedtimestory.jpg';
import romantic from '../assets/romantic.jpg';
import storycomic from '../assets/storycomic.jpg';
import opinion from '../assets/opinion.jpg';
import { useSelector } from 'react-redux';
import BeatLoader from "react-spinners/BeatLoader";
import axios from 'axios';

const Explorer = () => {
  const [loading, setloading] = useState(true);
  const audioD = useSelector((state) => state.data.audio);
  const [postData,setPostData] = useState([]);




  const [storyLikes, setstoryLikes] = useState(0);
  const [bedstoryLikes, setbedstoryLikes] = useState(0);
  const [horrorstoryLikes, sethorrorstoryLikes] = useState(0);
  const [funnystoryLikes, setfunnystoryLikes] = useState(0);
  const [romanticstoryLikes, setromanticstoryLikes] = useState(0);
  const [songLike, setsonglike] = useState(0);


  useEffect(() => {
        if(window.location.pathname!=="/"){
          if(audioD&&audioD.currentAudioPlaying){
           audioD.currentAudioPlaying.current.pause();
          }
        }
        document.title = 'Explorer • Voiry';
   }, []);



   useEffect(() => {
    let isMounted = true;
  
    const fetchData = async () => {
      try {
        const response = await axios.post(process.env.REACT_APP_SERVER_IP + "api/user/explorer/" ,{
          access_token:sessionStorage.getItem("_token")
        });
        if (response.status === 200 && isMounted) {
          setPostData(response.data);



          let likes = 0;
          for(var i=0;i<response.data.story.length;++i){
            likes+=response.data.story[i].likes.length;
          }
          setstoryLikes(likes);

          likes = 0;
          for(var i=0;i<response.data.bedtimestory.length;++i){
            likes+=response.data.bedtimestory[i].likes.length;
          }
          setbedstoryLikes(likes);

          likes = 0;
          for(var i=0;i<response.data.song.length;++i){
            likes+=response.data.song[i].likes.length;
          }
          setsonglike(likes);

          likes = 0;
          for(var i=0;i<response.data.horror.length;++i){
            likes+=response.data.horror[i].likes.length;
          }
          sethorrorstoryLikes(likes);

          likes = 0;
          for(var i=0;i<response.data.funny.length;++i){
            likes+=response.data.funny[i].likes.length;
          }
          setfunnystoryLikes(likes);

          likes = 0;
          for(var i=0;i<response.data.romantic.length;++i){
            likes+=response.data.romantic[i].likes.length;
          }
          setromanticstoryLikes(likes);

        }

        

        setloading(false);
      } catch (err) {
       // setProfile(null);

        setloading(false);
      }
    };
  
    fetchData();
  
    return () => {
      // Cleanup function
      isMounted = false;
      setloading(false);
    };
  }, []);



  return (
    <div className='w-full h-full flex items-center flex-col  '>
        <div className=' overflow-x-hidden overflow-y-hidden items-center absolute md:left-[250px] top-[100px] overflow-scroll flex flex-col space-y-9 '> 
            {!loading&&<><h1 className='text-[30px] text-center font-bold'>Explorer</h1>
            <div className='w-[300px] sm:w-[500px] md:w-full justify-center items-center h-full flex flex-row flex-wrap z-0 '>
                <ExplorerCard  tag="Story"  thumbnail={Story} audios={postData.story.length} likes={storyLikes} path="/tag/story"></ExplorerCard>
                <ExplorerCard  tag="Bed Time Story"  thumbnail={bedtimestory}  audios={postData.bedtimestory.length} likes={bedstoryLikes} path="/tag/bedtimestory"></ExplorerCard>
                <ExplorerCard  tag="Song"  thumbnail={song} audios={postData.song.length} likes={songLike} path="/tag/song"></ExplorerCard>
                <ExplorerCard  tag="Horror" thumbnail={Horror}  audios={postData.horror.length} likes={horrorstoryLikes} path="/tag/horror"></ExplorerCard>
                <ExplorerCard  tag="Funny" thumbnail={funny}  audios={postData.funny.length} likes={funnystoryLikes} path="/tag/funny"></ExplorerCard>
                <ExplorerCard  tag="Romantic" thumbnail={romantic} audios={postData.romantic.length} likes={romanticstoryLikes} path="/tag/romantic"></ExplorerCard>
            </div></>}
            {/* Empty Space */}
            <div className='h-[20px]'></div>
        </div>
        {loading&&   <div className='z-[10] items-center flex-wrap justify-center lg:flex-nowrap w-full flex flex-row overflow-x-hidden overflow-y-hidden absolute top-[100px]    '>
                
                <BeatLoader color="#36d7b7" />
                </div>}
    </div>
  )
}

export default Explorer;