import React,{useEffect,useState} from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from "react-redux";
import toast from 'react-hot-toast';
import {Link} from 'react-router-dom';
import axios from 'axios';

const EditProfile = () => {
  const user = useSelector((state) => state.data.user.user);
  const navigate = useNavigate();
  const isLoading = useSelector((state) => state.data.user.isLoading);
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [bio, setBio] = useState("");
  const audioD = useSelector((state) => state.data.audio);
  useEffect(() => {
    if(window.location.pathname!=="/"){
      if(audioD&&audioD.currentAudioPlaying){
        audioD.currentAudioPlaying.current.pause();
      }
    }
    document.title = 'Edit Profile • Voiry';
  }, []);
  useEffect(() => {
      if(!isLoading&&!user){
        navigate('/signin');
      }
  }, [isLoading,user]);
  const [newProfileImage, setnewProfileImage] = useState(null);
  const upload = async () => {
    try {

        // Make a POST request to your backend server
        await axios.post(process.env.REACT_APP_SERVER_IP+"api/user/update",{  
          email: user.email,
          profilePicture: newProfileImage,
          bio,
          firstname,
          lastname,
          access_token:sessionStorage.getItem("_token")
        });
        window.location = '/profile';
    } catch (error) {
      toast.error("Error updating profile "+error);
    }
  };
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
  
    if (file) {
      const reader = new FileReader();
  
      reader.onloadend = () => {
        setnewProfileImage(reader.result);
      };
  
      reader.readAsDataURL(file);
    }
  };
  return (
    <div className='w-full h-full flex items-center flex-col '>
       {user&& <div className='z-[10] overflow-x-hidden overflow-y-hidden items-center absolute top-[100px] overflow-scroll flex flex-col space-y-9 '> 
          <div className='sm:w-[400px]  sm:h-[400px]  flex flex-col items-center justify-center sm:border'>
          <div className='w-full flex flex-col items-center justify-center mb-[15px]'>
          <label htmlFor="file-upload" className='custom-file-upload'>
            <img src={newProfileImage||user.profilePicture} alt="lock" className='w-[120px] h-[120px] sm:w-[140px] sm:h-[140px] rounded-full'/>
          </label>
        <input 
          type="file"
          lable="Image"
          name="myFile"
          id='file-upload'
          accept='.jpeg, .png, .jpg'
          className='hidden'
          onChange={(e) => handleFileUpload(e)}
         />
          </div>
         <div className=' sm:w-[350px] flex flex-col items-center justify-center'>
          <input onChange={(e)=>{setFirstname(e.target.value)}} className='w-full border h-[40px]  rounded mb-2 text-[17px] placeholder:text-[15px] pl-2 outline-none' type="text" placeholder={user.firstname||'Firstname'}/>
          <input onChange={(e)=>{setLastname(e.target.value)}} className='w-full border h-[40px] ] rounded mb-2 text-[17px] placeholder:text-[15px] pl-2 outline-none' type="text" placeholder={user.lastname||'Lastname'}/>
          <input onChange={(e)=>{setBio(e.target.value)}} className='w-full border h-[40px]  rounded mb-2 text-[17px] placeholder:text-[15px] pl-2 outline-none' type="text" placeholder={user.bio||'Bio'}/>
          <button onClick={upload} className='hover:bg-[#4D918F] w-full h-[40px]  border bg-[#5ABCB9] rounded-md text-[18px] font-semibold text-white'>Save</button>
         </div>
         
          </div>
          <Link to="/reset-password"><button className='hover:bg-[#4D918F] w-full sm:w-[350px] h-[40px] border  border-[#5ABCB9]  rounded-md text-[18px] font-semibold text-[#5ABCB9]'>Change Password</button></Link>
        </div>}
    </div>
  )
}

export default EditProfile