import React,{useEffect,useState} from 'react'
import { Link,useNavigate } from 'react-router-dom';
import Character from '../assets/Character.svg';
import {useSelector} from 'react-redux';
import Google from '../assets/google.png';
import fb from '../assets/fb.jpg';
import axios from 'axios';
import toast from 'react-hot-toast';
import BeatLoader from "react-spinners/BeatLoader";

const SignIn = () => {



  const [loading, setloading] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const navigate = useNavigate();
 

  const homePage=()=>{
    navigate('/');
  }

  const audioD = useSelector((state) => state.data.audio);
    useEffect(() => {
      if(window.location.pathname!=="/"){
        if(audioD&&audioD.currentAudioPlaying){
          audioD.currentAudioPlaying.current.pause();
        }
      }
      document.title = 'Sign In • Voiry';
    }, []);
  const handleLogin = async(e) => {
    e.preventDefault();
    setloading(true);
    try{
      const response = await axios.post(process.env.REACT_APP_SERVER_IP+"api/auth/signin",{
        email,
        password,
      });
      if(response.status==200){
        const token = response.data.token;
        sessionStorage.setItem("_token",token);
        window.location = '/';
      }
    }catch(err){
      setloading(false);
      toast.error("Invalid email or password!")
    }
  };
  useEffect(() => {
    document.title = 'Login • Voiry';
  }, []);
  return (
    <div className='w-full h-screen'>
      <div className='fixed flex flex-row  top-[10px] ml-[25px] space-x-2 w-full' onClick={homePage}><div className='w-[30px] h-[30px] bg-[#009C79] rounded-full cursor-pointer'></div><h1 className='font-bold cursor-pointer'>Voiry</h1></div>
      <div className='w-full h-full flex flex-row'>
      <div className='hidden md:flex md:w-2/3 h-screen flex-row items-center justify-center'>
          <img src={Character} alt="" className='w-[350px] h-[500px]'/>
      </div>
      <div className='w-full h-full bg-[white] sm:bg-[#63E2C6] flex flex-col items-center justify-center'>
      {!loading&&<>
          <div className='sm:w-[300px] text-start mt-[60px] sm:mt-[80px]'>
            <h1 className='font-bold sm:text-[white] text-[#63E2C6] text-[20px] sm:text-[30px]'>Welcome back</h1>
          </div>
          <div className='flex flex-col sm:w-[300px] h-full space-y-3  mt-[40px] mb-3'>
            <input onChange={(e)=>setEmail(e.target.value)} type="email" className='outline-none sm:text-[18px] sm:placeholder:text-[16px] text-[12px] placeholder:text-[12px] bg-[white] sm:bg-[#63E2C6] pb-1 border-b-[rgb(230,230,230)] border-b' placeholder='Email'/>
            <input onChange={(e)=>setPassword(e.target.value)} type="password" className='outline-none sm:text-[18px] sm:placeholder:text-[16px] placeholder:text-[12px] bg-[white] sm:bg-[#63E2C6] pb-1 border-b-[rgb(230,230,230)] border-b' placeholder='Password'/>
            <div></div>
            <button onClick={handleLogin} className='w-full text-white font-semibold h-[40px] bg-[#009C79] rounded'>Sign In</button>
            <p className='text-center text-[10px] cursor-pointer sm:text-[13px]'>Forgot Password</p>


            <div className='w-full text-center items-center justify-center '>
          <div className=' mt-[20px]'>
            <p className='text-[12px] sm:text-[14px]'>Dont have and account? <Link to='/signup' className='text-[#009C79] font-bold cursor-pointer'>Sign Up</Link></p>
          </div>
          <div>
          <div className='mt-[80px] w-full'>
          <div className=' flex flex-col w-full  items-center justify-center'>
            <h1 className='text-[rgb(230,230,230)] font-bold'>-OR-</h1>
          </div>
          <div  className='w-full mt-[40px]  justify-center items-center flex flex-col sm:flex-row '>
              <div className=' text-center px-1  justify-center flex flex-row mb-2 sm:mb-0 mr-0 sm:mr-2 text-[12px] items-center space-x-2 bg-white/75 w-[190px] h-[40px] rounded cursor-pointer'><img src={Google} className='w-[30px] h-[30px] bg-[#009C79] rounded-[1000px]'></img><h1>Google</h1></div>
              <div className=' text-center px-1 justify-center flex flex-row text-[12px] items-center space-x-2 bg-white/75 w-[190px] h-[40px] rounded cursor-pointer'><img src={fb} className='w-[30px] h-[30px] bg-[#009C79] rounded-full'></img><h1>Facebook</h1></div>
          </div>
          </div>
          </div>
          </div>
          </div>

</>}
{
  loading&&<BeatLoader></BeatLoader>
}
      </div>
      </div>
     </div>
  )
}

export default SignIn