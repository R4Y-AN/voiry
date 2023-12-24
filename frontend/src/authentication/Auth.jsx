import React,{useEffect,useState} from 'react';
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from "react-redux";
import { Link } from 'react-router-dom';
import Home from '../pages/Home';
import AuthRouter from './AuthRouter';
import {Route,Routes} from 'react-router-dom';
import SignUp from '../pages/SignUp';
import SignIn from '../pages/SignIn';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Button from '@mui/material/Button';


function Auth({children}){
    const user = useSelector((state) => state.data.user.user);
    const isLoading = useSelector((state) => state.data.user.isLoading);
    const navigate = useNavigate();
    useEffect(() => {
      if(user){
        navigate("/");
      }
  }, [user]);


    return (
        <div className="app">
          {isLoading ? (
            <div>
              <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={true}
        
      >
        <CircularProgress color="inherit" />
      </Backdrop>
            </div>
          ) : (
            children
          )}
        </div>
      );
}
export default Auth;