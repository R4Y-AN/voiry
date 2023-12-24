import React,{useState,useEffect} from 'react'
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import CardView from '../components/CardView';
import {Route,Routes} from 'react-router-dom';
import Upload from './Upload';
import Profile from './Profile';
import Contest from './Contest';
import Following from './Following';
import EditProfile from './EditProfile';
import OthersProfile from './OthersProfile';
import ResetPass from './ResetPass';
import Explorer from './Explorer';
import TagViewer from './TagViewer';
import UpdateAudioPage from './UpdateAudioPage';
import MessagePage from './MessagePage';
import CustomAudioPage from './CustomAudioPage';
import SaveAudios from './SaveAudios';
import { useSelector } from "react-redux";

const Home = () => {
const user = useSelector((state) => state.data.user.user);
const isLoading = useSelector((state) => state.data.user.isLoading);
return (
    <div>
        <Navbar></Navbar>
        <Sidebar></Sidebar>   
        <Routes>
          {!isLoading&&<Route path='*' element={<><OthersProfile></OthersProfile></>}></Route>}
          <Route path='/' element={<><CardView ></CardView></>}></Route>
          <Route path='/search/:query' element={<><CardView></CardView></>}></Route>
          {!isLoading&&user&&sessionStorage.getItem("_token")&&<Route path='/message' element={<><MessagePage></MessagePage></>}></Route>}
          {!isLoading&&user&&sessionStorage.getItem("_token")&&<Route path='/message/:username' element={<><MessagePage></MessagePage></>}></Route>}
          {!isLoading&&user&&sessionStorage.getItem("_token")&&<Route path='/mysavedposts' element={<><SaveAudios></SaveAudios></>}></Route>}
          <Route path='/tag/:tagId' element={<><TagViewer></TagViewer></>}></Route>
          <Route path='/update/:audioId' element={<><UpdateAudioPage></UpdateAudioPage></>}></Route>
          <Route path='/audio/:audioId' element={<><CustomAudioPage></CustomAudioPage></>}></Route>
          <Route path='/upload' element={<><Upload></Upload></>}></Route>
          <Route path='/explorer' element={<><Explorer></Explorer></>}></Route>
          <Route path='/following' element={<><Following></Following></>}></Route>
          <Route path='/profile' element={<><Profile></Profile></>}></Route>
          <Route path='/profile/edit' element={<><EditProfile></EditProfile></>}></Route>
          <Route path='/contest' element={<><Contest></Contest></>}></Route>
          <Route path='/reset-password' element={<><ResetPass></ResetPass></>}></Route>
        </Routes>
    </div>
   )

}

export default Home