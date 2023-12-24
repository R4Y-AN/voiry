import React,{useEffect,useState} from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector,useDispatch } from "react-redux";
import toast from 'react-hot-toast';
import {Link} from 'react-router-dom';
import axios from 'axios';
import {
    ref,
    uploadBytes,
    getDownloadURL,
  } from "firebase/storage";
  import { storage } from "../firebase";
  import { v4 } from "uuid";
  import BeatLoader from "react-spinners/BeatLoader";
  
const EditProfile = () => {
    const [profile, setProfile] = useState(null);
    const user = useSelector((state) => state.data.user.user);
    const navigate = useNavigate();
    const isLoading = useSelector((state) => state.data.user.isLoading);
    const [profilePic, setProfilePath] = useState();
    const [firstname, setFirstname] = useState("");
    const [lastname, setLastname] = useState("");
    const [bio, setBio] = useState("");
    const [loading, setloading] = useState(false);

    const audioD = useSelector((state) => state.data.audio);
    useEffect(() => {
      if(window.location.pathname!=="/"){
        if(audioD&&audioD.currentAudioPlaying){
          audioD.currentAudioPlaying.current.pause();
        }
      }
      document.title = 'Edit Profile • Voiry';
    }, []);
  
  
  
    const upload = async () => {
      setloading(true);
      try {
        if (profile) {
          const profileRef = ref(storage, `profile/${profile.name + v4()}`);
          const uploadProfileTask = uploadBytes(profileRef, profile);
    
          const [uploadResult] = await Promise.all([uploadProfileTask]);
          const profilePath = await getDownloadURL(uploadResult.ref);
    
    
          // Once both audio and thumbnail are uploaded, send data to the backend
          await axios.post(process.env.REACT_APP_SERVER_IP+"api/user/update",{  
            email: user.email,
            profilePicture: profilePath,
            access_token:sessionStorage.getItem("_token")
          });
    
         
        }
        const postData = {
            email: user.email,
            bio,
            firstname,
            lastname,
            access_token:sessionStorage.getItem("_token")
        };
    
          // Make a POST request to your backend server
          await axios.post(process.env.REACT_APP_SERVER_IP+"api/user/update",{  
            email: user.email,
            bio,
            firstname,
            lastname,
            access_token:sessionStorage.getItem("_token")})
          toast.success("Profile Updated");  
          setloading(false);
         // window.location = '/profile';
          
      } catch (error) {
        setloading(false);
        toast.error("Error updating profile");
      }
      window.location.reload();
      setloading(false);
    };
    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        setProfile(file);
        if (file) {
          const reader = new FileReader();
      
          reader.onloadend = () => {
            setProfilePath(reader.result);
          };
      
          reader.readAsDataURL(file);
        }
      };
  return (
    <div className='w-full h-full flex items-center flex-col '>
       {user&& <div className='z-[10] overflow-x-hidden overflow-y-hidden items-center absolute top-[100px] overflow-scroll flex flex-col space-y-9 '> 
          {!loading&&<div className='sm:w-[400px]  sm:h-[410px]  flex flex-col items-center justify-center sm:border'>
          <div className='w-full flex flex-col items-center justify-center mb-[15px]'>
          <label htmlFor="file-upload" className='custom-file-upload'>
            <img src={profilePic||user.profilePicture} alt="lock" className='w-[120px] h-[120px] sm:w-[140px] sm:h-[140px] rounded-full'/>
          </label>
        <input 
          type="file"
          lable="Image"
          name="myFile"
          id='file-upload'
          accept='.jpeg, .png, .jpg'
          className='hidden'
          onChange={handleFileUpload}
         />
          </div>
         <div className=' sm:w-[350px] flex flex-col items-center justify-center'>
          <input onChange={(e)=>{setFirstname(e.target.value)}} className='w-full border h-[40px]  rounded mb-2 text-[17px] placeholder:text-[15px] pl-2 outline-none' type="text" placeholder={user.firstname||'Firstname'}/>
          <input onChange={(e)=>{setLastname(e.target.value)}} className='w-full border h-[40px] ] rounded mb-2 text-[17px] placeholder:text-[15px] pl-2 outline-none' type="text" placeholder={user.lastname||'Lastname'}/>
          <input onChange={(e)=>{setBio(e.target.value)}} className='w-full border h-[40px]  rounded mb-2 text-[17px] placeholder:text-[15px] pl-2 outline-none' type="text" placeholder={user.bio||'Bio'}/>
          <button onClick={upload} className='hover:bg-[#4D918F] w-full h-[40px] mb-2   border bg-[#5ABCB9] rounded-md text-[18px] font-semibold text-white'>Save</button>
          <Link to="/reset-password" className='w-full'><button className='hover:bg-[#4D918F] mb-2 w-full h-[40px] border  border-[#5ABCB9]  rounded-md text-[18px] font-semibold text-[#5ABCB9]'>Change Password</button></Link>
         </div>
        
          </div>}
          {
            loading&&
            <BeatLoader color="#36d7b7" />
           }
        </div>}
    </div>
  )
}

export default EditProfile