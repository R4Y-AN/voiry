import React,{useEffect,useState} from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import BeatLoader from "react-spinners/BeatLoader";
import NewCard from '../components/NewCard';

const TagViewer = () => {
  const { tagId } = useParams();
  const [feedData, setFeedData] = useState([]);
  const [loading, setloading] = useState(true);

  useEffect(() => {
      document.title = tagId+' • Voiry';
   }, []);



   useEffect(() => {
    setloading(true);
    // Fetch data from the backend using Axios
    const fetchData = async () => {
      try {
        const response = await axios.post(process.env.REACT_APP_SERVER_IP+"api/user/tag/"+tagId,{
          access_token:sessionStorage.getItem("_token")
        });
        const data = await response.data;
        if (Array.isArray(data)) {
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


  return (
    <div className='w-full h-full flex items-center flex-col'>
      <div className='z-[10] overflow-x-hidden overflow-y-hidden items-center absolute top-[100px] overflow-scroll flex flex-col space-y-[100px] '>
        {!loading&&feedData.length!=0&&Array.isArray(feedData) && feedData.map((item) => (
          <NewCard
          key={item._id}
          id={item._id}
          author={item.author}
          userId={item.userId}
          title={item.title}
          shortDesc={item.shortDesc}
          thumbnail={item.thumbnail}
          audioFile={item.audioFilePath}
          likes={item.likes}
          playCount={item.playCount}
          />
        ))}
        {
          loading&&
          <BeatLoader color="#36d7b7" />
        }
        {(!feedData.length!=0||!feedData)&&!loading&&
            <h1>No Post Found!</h1>
        }
        <div className='h-[20px]'></div>
      </div>
    </div>
  );
}

export default TagViewer