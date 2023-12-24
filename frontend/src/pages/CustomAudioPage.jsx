import React,{useEffect,useState} from 'react'
import { useSelector } from 'react-redux';
import NewCard from '../components/NewCard';
import axios from 'axios';
import { useParams,useNavigate } from 'react-router-dom';
import BeatLoader from "react-spinners/BeatLoader";
import toast from 'react-hot-toast';

const CustomAudioPage = () => {
  
  const user = useSelector((state) => state.data.user.user);
  const [feedData, setFeedData] = useState(null);
  const { audioId } = useParams();
  const [loading, setloading] = useState(true);

  const navigate = useNavigate();

  const audioD = useSelector((state) => state.data.audio);
  useEffect(() => {
        if(window.location.pathname!=="/"){
          if(audioD&&audioD.currentAudioPlaying){
           audioD.currentAudioPlaying.current.pause();
          }
        }
        document.title = 'Voiry';
   }, []);



   useEffect(() => {
    setloading(true);
    // Fetch data from the backend using Axios
    const fetchData = async () => {
      try {
        const response = await axios.post(process.env.REACT_APP_SERVER_IP+"api/user/audio/"+audioId,{
          access_token:sessionStorage.getItem("_token")
        });
        const data = await response.data;
        if(response.status==200){
          setFeedData(data);
        }
        setloading(false);
      } catch (error) {
        setloading(false);
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []); 

  const handleDelete=async()=>{
    setloading(true);
    try{
      const response = await axios.post(process.env.REACT_APP_SERVER_IP+"api/user/deletePost/"+feedData._id,{
        access_token:sessionStorage.getItem("_token")
      });
      if(response.status==200){
        toast.success("Post Deleted!");
        window.location='/';
        return;
      }
    }catch(err){
      setloading(false);
      toast.error("Cannot delete this post!");
    }
  }
  const handleEdit=()=>{
    navigate("/update/"+feedData._id);
  }

  return (
    <div className='w-full h-full flex items-center flex-col '>
        <div className='z-[10] overflow-x-hidden overflow-y-hidden items-center absolute top-[100px] overflow-scroll flex flex-col space-y-9 '> 
        {!loading&& feedData &&
        <>
          <NewCard
            key={feedData._id}
            id={feedData._id}
            author={feedData.author}
            title={feedData.title}
            shortDesc={feedData.shortDesc}
            thumbnail={feedData.thumbnail}
            audioFile={feedData.audioFilePath}
            likes={feedData.likes}
            playCount={feedData.playCount}
          />
          {sessionStorage.getItem("_token")&&user&&feedData.userId==user.id&&<div className='w-full flex flex-row items-center justify-center space-x-2'>
          <button onClick={handleEdit} className='w-[30%] py-2 border rounded hover:text-[white] hover:bg-black'>Edit Post</button>
          <button onClick={handleDelete} className='w-[30%] py-2 border rounded border-[red] text-[red] hover:bg-[red] hover:text-[white]'>Delete Post</button>
          </div>}
          </>
        }
        
            {
          loading&&
          <BeatLoader color="#36d7b7" />
        }
        {(!feedData)&&!loading&&
            <h1>No Post Found!</h1>
        }
        <div className='h-[20px]'></div>
        </div>
    </div>
  )
}

export default CustomAudioPage