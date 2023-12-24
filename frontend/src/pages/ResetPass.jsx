import React,{useState,useEffect} from 'react';
import LockIcon from '../assets/lock.png';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom'
import { useSelector } from "react-redux";
import BeatLoader from "react-spinners/BeatLoader";

const ResetPass = ()=>{
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const user = useSelector((state) => state.data.user.user);
    const navigate = useNavigate();
    const isLoading = useSelector((state) => state.data.user.isLoading);
    const [loading, setloading] = useState(false);

    useEffect(() => {
        if(!isLoading&&!user){
          navigate('/signin');
        }
    }, [isLoading,user]);

    const handleSave=async()=>{
        setloading(true);
        if(oldPassword.trim()==""||newPassword.trim()==""||newPassword!=confirmPassword||newPassword==oldPassword){
            toast.error('Invalid Password!');
            return;
        }
        try{
            const response = await axios.post(process.env.REACT_APP_SERVER_IP+"api/user/change-password",{
                oldPassword,
                newPassword,
                access_token:sessionStorage.getItem("_token")
            })
            if(response.status==201){
                const newToken = response.data.token;
                sessionStorage.setItem("_token",newToken);
            }
            setloading(false);
            window.location='/';
        }catch(err){
            setloading(false);
            toast.error('Invalid Password!');
        }
    } 


    const audioD = useSelector((state) => state.data.audio);
    useEffect(() => {
      if(window.location.pathname!=="/"){
        if(audioD&&audioD.currentAudioPlaying){
          audioD.currentAudioPlaying.current.pause();
        }
      }
      document.title = 'Reset Password • Voiry';
    }, []);

    return (
    <div className='w-full h-full flex items-center flex-col '>
        <div className='z-[10] overflow-x-hidden overflow-y-hidden items-center absolute top-[100px] overflow-scroll flex flex-col space-y-9 '> 
         {!loading&&<> <div className='sm:w-[400px]  sm:h-[400px]  flex flex-col items-center justify-center sm:border'>
          <div className='w-full flex flex-col items-center justify-center mb-[15px]'>
            <img src={LockIcon} alt="lock" className='w-[40px] mb-2 h-[40px] sm:w-[80px] sm:h-[80px]'/>
            <h1 className='text-[21px] font-semibold'>Reset Password</h1>
          </div>
         <div className=' sm:w-[350px] flex flex-col items-center justify-center'>
          <input onChange={(e)=>{setOldPassword(e.target.value)}} className='w-full border h-[40px]  rounded mb-2 text-[17px] placeholder:text-[15px] pl-2 outline-none' type="password" placeholder='Old Password'/>
          <input onChange={(e)=>{setNewPassword(e.target.value)}} className='w-full border h-[40px] placeholder:text-[#63E2C6] rounded mb-2 text-[17px] placeholder:text-[15px] pl-2 outline-none' type="password" placeholder='New Password'/>
          <input onChange={(e)=>{setConfirmPassword(e.target.value)}} className='w-full border h-[40px] placeholder:text-[#63E2C6] rounded mb-2 text-[17px] placeholder:text-[15px] pl-2 outline-none' type="password" placeholder='Confirm Password'/>
          <button onClick={handleSave} className='hover:bg-[#4D918F] w-full h-[40px]  border bg-[#5ABCB9] rounded-md text-[18px] font-semibold text-white'>Save</button>
         </div>
          </div></>}
          {loading&&
              <BeatLoader color="#36d7b7" />
          }
        </div>
    </div>
    )
}
export default ResetPass;