import React,{useEffect,useState} from 'react'
import { useNavigate,useParams } from 'react-router-dom'
import { useSelector } from "react-redux";
import toast from 'react-hot-toast';
import BeatLoader from "react-spinners/BeatLoader";
import axios from 'axios';

const UpdateAudioPage = () => {
  const user = useSelector((state) => state.data.user.user);

  const [feedData, setFeedData] = useState(null);
  const { audioId } = useParams();

  const [thumbnailFile, setThumbnailPath] = useState(null);
  const [thumbnailPath, setThumbnail64] = useState(null);
  
  const [caption, setCaption] = useState(null);
  const [description, setShortDescription] = useState(null);
  const [type, setType] = useState(null);
  const navigate = useNavigate();
  const isLoading = useSelector((state) => state.data.user.isLoading);
  const [loading, setloading] = useState(true);
  
  const [captionPlaceHolder, setPlaceHolderCaption] = useState("");
  const [placeHolderDescription, setPlaceholderDescription] = useState("");
  const [typePlaceholder, settypeplaceHolder] = useState("Story");

  //code for pausing the audio
  const audioD = useSelector((state) => state.data.audio);
  useEffect(() => {
  if(window.location.pathname!=="/"){
    if(audioD&&audioD.currentAudioPlaying){
      audioD.currentAudioPlaying.current.pause();
    }
  }
  document.title = 'Update • Voiry';
  }, []); // pausing audio code ends here

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
          if(!user||!sessionStorage.getItem("_token")
          ||response.data.userId!=user.id){
            navigate("/");
          }

          setPlaceHolderCaption(response.data.title);
          setPlaceholderDescription(response.data.shortDesc);
          setThumbnail64(response.data.thumbnail);
          settypeplaceHolder(response.data.type);

        }else{
          toast.error("Error Occurred!");
          navigate("/");
        }
        setloading(false);
      } catch (error) {
        setloading(false);
        toast.error("Error Occurred!")
        navigate("/");
      }
    };
    fetchData();
  }, []); 

  // checking that user logged in or not if logged out then user will redirect to the signin page
     useEffect(() => {
      if(!isLoading&&!user){
        navigate('/signin');
      }
  }, [isLoading,user]);  
 

  const upload = () => {
    setloading(true);

    // Validate that all required fields are filled
    if (!caption && !description && !type) {
      toast.error("Please fill in all required fields");
      setloading(false);
      return;
    }

    // You can add more validations as needed

    // Prepare data for updating the post
    const postData = {
      title: caption,
      shortDesc: description,
      type,
      access_token: sessionStorage.getItem("_token"),
    };

    // Make a PUT request to update the post
    axios
      .put(process.env.REACT_APP_SERVER_IP + `api/user/post/${audioId}`, postData)
      .then((response) => {
        if (response.status === 200) {
          setloading(false);
          toast.success("Post Updated!");
          navigate("/audio/"+audioId);
        } else {
          setloading(false);
          toast.error("Error Occurred!");
        }
      })
      .catch((error) => {
        setloading(false);
        toast.error("Error updating post");
      });
  };
return (
  <div className='w-full h-full flex items-center flex-col '>
      <div className='z-[10]  flex-wrap justify-center lg:flex-nowrap w-full  flex overflow-x-hidden overflow-y-hidden absolute top-[100px] overflow-scroll  '> 

       {!loading&&<>



         <div className='w-full md:ml-[100px] h-full mt-[30px] flex flex-col items-center justify-center'>
            <div className='text-start  w-[80%] sm:w-[350px] mb-[30px]'>
              <h1 className='text-[25px] font-bold'>Update Audio</h1>
              <h3>Edit your post</h3>
            </div>
              <div className=' w-[80%] sm:w-[350px]'>
                  <h1 className='text-[19px]'>Caption</h1>
                  <input placeholder={captionPlaceHolder} onChange={(e)=>{setCaption(e.target.value)}} type="text" className='pl-2 w-[80%] sm:w-[350px] h-[33px] border rounded outline-none mb-6' name="" id="" />
              </div>



        
              <div className=' w-[80%] sm:w-[350px]'>
                  <h1 className='text-[19px]'>Description</h1>
                  <input placeHolder={placeHolderDescription} onChange={(e)=>{setShortDescription(e.target.value)}} type="text" className='pl-2  w-[80%] sm:w-[350px] h-[33px] border rounded outline-none mb-6' name="" id="" />
              </div>
              <div className='flex flex-col w-[80%] sm:w-[350px]'>
              <label for="audiType"  className='mb-[5px] h-full'><h1 className='text-[19px]'>Type:</h1></label>
                 <select id="audiType" defaultValue={typePlaceholder} onChange={(e)=>{setType(e.target.value)}} name="audiType" className='ml-[-2px] mb-[20px] border rounded outline-none pl-2 w-[80%] sm:w-[350px] h-[33px]'>
                     <option value="Story">Story</option>
                     <option value="BedTimeStory">Bed Time Story</option>
                     <option value="Song">Song</option>
                     <option value="Horror">Horror</option>
                     <option value="Funny">Funny</option>
                     <option value="Romantic">Romantic</option>
                     <option value="Comic">Comic</option>
                     <option value="Opinion">Opinion</option>
                  </select>



              </div>
              <div className='w-[80%] sm:w-[350px]'>
              <button onClick={upload} className='hover:bg-[#4D918F] w-[80%] sm:w-[350px] mb-[100px] h-[40px]  border bg-[#5ABCB9] rounded-md text-[15px] font-semibold text-white'>Update</button>
              </div>
             
         </div></>}
        
      </div>
      {loading&&
          <div className='z-[10] items-center flex-wrap justify-center lg:flex-nowrap w-full flex flex-row overflow-x-hidden overflow-y-hidden absolute top-[100px]    '>
              
          <BeatLoader color="#36d7b7" />
          </div>
         }
  </div>
 )

}

export default UpdateAudioPage