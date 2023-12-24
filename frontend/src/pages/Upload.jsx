import React,{useEffect,useState} from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from "react-redux";
import {
  ref,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import { storage } from "../firebase";
import { v4 } from "uuid";
import toast from 'react-hot-toast';
import UploadIcon from '../assets/upload_new.png';
import BeatLoader from "react-spinners/BeatLoader";

const Upload = () => {
    const user = useSelector((state) => state.data.user.user);

    const [audioFile, setAudioFile] = useState(null);

    const [thumbnailFile, setThumbnailPath] = useState(null);
    const [thumbnailPath, setThumbnail64] = useState(null);
    const [caption, setCaption] = useState(null);
    const [description, setShortDescription] = useState(null);
    const [type, setType] = useState("Story");
    const navigate = useNavigate();
    const isLoading = useSelector((state) => state.data.user.isLoading);
    const [loading, setloading] = useState(false);

    //code for pausing the audio
    const audioD = useSelector((state) => state.data.audio);
    useEffect(() => {
    if(window.location.pathname!=="/"){
      if(audioD&&audioD.currentAudioPlaying){
        audioD.currentAudioPlaying.current.pause();
      }
    }
    document.title = 'Upload • Voiry';
    }, []); // pausing audio code ends here


    // checking that user logged in or not if logged out then user will redirect to the signin page
      useEffect(() => {
        if(!isLoading&&!user){
          navigate('/signin');
        }
    }, [isLoading,user]);  


    const upload = () => {
        setloading(true);
        // checking user logged in or not.
        if(!user||!sessionStorage.getItem("_token")){
            toast.error("Cannot Authenticate!")
            setloading(false);
            return;
        }
        
        //  Validate that all required fields are filled
        if (audioFile == null || thumbnailFile == null || caption == null || description == null || type == null) {
            toast.error("Please fill in all required fields");
            setloading(false);
            return;
        }
        const audioImageRef = ref(storage, `audios/${audioFile.name + v4()}`);
        const thumbnailImageRef = ref(storage, `thumbnails/${thumbnailFile.name + v4()}`);
    
        const uploadAudioTask = uploadBytes(audioImageRef, audioFile);
        const uploadThumbnailTask = uploadBytes(thumbnailImageRef, thumbnailFile);
        Promise.all([uploadAudioTask, uploadThumbnailTask])
            .then((uploadResults) => {
                const audioDownloadURL = getDownloadURL(uploadResults[0].ref);
                const thumbnailDownloadURL = getDownloadURL(uploadResults[1].ref);
                
                Promise.all([audioDownloadURL, thumbnailDownloadURL])
                    .then(([audioURL, thumbnailURL]) => {
    
                        // Once both audio and thumbnail are uploaded, send data to the backend
                        const postData = {
                            title:caption,
                            thumbnail: thumbnailURL,
                            audioFilePath: audioURL,
                            type,
                            shortDesc:description, 
                            access_token:sessionStorage.getItem("_token")
                        };
    
                        // now send all data's to the backend server (:
                        fetch(process.env.REACT_APP_SERVER_IP+"api/user/post", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify(postData),
                        })
                            .then((response) => response.json())
                            .then((data) => {
                               // success
                                setloading(false);
                                toast.success("Post Uploaded!");
                                navigate("/");
                            })
                            .catch((error) => {setloading(false);
                                toast.error("Error sending data to the server");
                            });
                    })
                    .catch((error) => {setloading(false);
                        toast.error("Error getting download URLs");
                    });
            })
            .catch((error) => {setloading(false);
                toast.error("Error uploading files");
            });
            
    };
    
    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
        
            reader.onloadend = () => {
              setThumbnail64(reader.result);
            };
            setThumbnailPath(file);
            reader.readAsDataURL(file);
        }
        
    }
return (
    <div className='w-full h-full flex items-center flex-col '>
        <div className='z-[10]  flex-wrap justify-center lg:flex-nowrap w-full md:left-[25%] flex flex-row overflow-x-hidden overflow-y-hidden absolute top-[100px] overflow-scroll  '> 
  
         {!loading&&<>  <div className='w-[70%]  lg:w-1/3 h-full flex flex-col space-y-5'>
              <div>
              <h1 className='text-[25px] font-bold'>Upload Audio</h1>
             <h3>Post a audio to your account</h3>
              </div>
             <div className='border-dotted rounded text-[#676767]  border-[black] border  sm:w-[70%] h-[280px] sm:h-[350px] flex flex-col items-center justify-between py-10'>
                    <div className='w-full flex flex-col items-center'>
                         <img src={UploadIcon} className='w-[50px] h-[50px]' alt="" />
                         {!audioFile&&<h1>Select audio to upload</h1>}
                         {audioFile&&<h1>File Selected</h1>}
                    </div>
                    <div>
                       <h1>MP3 or WAV</h1>
                     <h1>Less then 5MB</h1>
                    </div>
                    <label  htmlFor="audio-file-upload" className='hover:bg-[#4D918F] text-center flex justify-center items-center w-[60%] h-[40px] border bg-[#63E2C6] rounded-md text-[15px] font-semibold text-white'>
                        {!audioFile&&"Select Audio"}{audioFile&&"Change Audio"}
                        <input type="file" lable="Image" name="myFile" id='audio-file-upload' accept='.mp3'  className='hidden' onChange={(e) => setAudioFile(e.target.files[0])}/>
                    </label>
                    
             </div>
           </div>



           <div className='w-[70%] lg:w-[67%] h-full mt-[77px]'>
                <div>
                    <h1 className='text-[19px]'>Caption</h1>
                    <input onChange={(e)=>{setCaption(e.target.value)}} type="text" className='pl-2 w-full sm:w-[350px] h-[33px] border rounded outline-none mb-6' name="" id="" />
                </div>



                <div>
                    <h1 className='text-[19px]'>Cover</h1>
                  
                    <label  htmlFor="file-upload" className=' custom-file-upload sm:w-[350px] flex flex-row rounded cursor-pointer h-[180px] bg-[#F8F8F8] mb-6 items-center justify-center'>
                        {!thumbnailPath&&<h1>Select Image</h1>}
                        {thumbnailPath&&<img src={thumbnailPath} className='w-full h-full object-cover rounded' alt="" />}
                        <input type="file" lable="Image" name="myFile" id='file-upload' accept='.jpeg, .png, .jpg'  className='hidden' onChange={handleFileUpload}/>
                    </label>
                </div>

                <div>
                    <h1 className='text-[19px]'>Description</h1>
                    <input onChange={(e)=>{setShortDescription(e.target.value)}} type="text" className='pl-2 w-full sm:w-[350px] h-[33px] border rounded outline-none mb-6' name="" id="" />
                </div>
                <div className='flex flex-col'>
                <label for="cars"  className='mb-[5px] h-full'><h1 className='text-[19px]'>Type:</h1></label>
                   <select id="cars" onChange={(e)=>{setType(e.target.value)}} name="cars" className='ml-[-2px] mb-[20px] border rounded outline-none pl-2 w-full sm:w-[350px] h-[33px]'>
                       <option value="story">Story</option>
                       <option value="bedtimestory">Bed Time Story</option>
                       <option value="song">Song</option>
                       <option value="horror">Horror</option>
                       <option value="funny">Funny</option>
                       <option value="romantic">Romantic</option>
                    </select>



                </div>
      
                <button onClick={upload} className='hover:bg-[#4D918F] w-full sm:w-[350px] mb-[100px] h-[40px] mr-2 border bg-[#5ABCB9] rounded-md text-[15px] font-semibold text-white'>Post</button>
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

export default Upload;