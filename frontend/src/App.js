import React, { useEffect,useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Home from './pages/Home';
import { useDispatch,useSelector } from 'react-redux';
import { loginUser, logoutUser, setLoading } from './features/userSlice';
import Auth from './authentication/Auth';
import axios from 'axios';
import { Toaster } from 'react-hot-toast';
import NoServer from './pages/NoServer';

function App() {
  const dispatch = useDispatch();
  const REFRESH_TIME = 10;
  useEffect(() => {
    const refreshInterval = setInterval(async () => {
      if (sessionStorage.getItem('_token')) {
        try {
          const refreshedToken = await axios.post(
            process.env.REACT_APP_SERVER_IP+'api/user/refresh',
            {
              access_token: sessionStorage.getItem('_token'),
            }
          );

          // Assuming the response includes a new token in the data
          const newToken = refreshedToken.data.token;

          // Update the session storage with the new token
          sessionStorage.setItem('_token', newToken);
        } catch (error) {
          // If an error occurs during token refresh, log out the user
          sessionStorage.clear();
          dispatch(logoutUser());
          window.location='/';
        }
      }
    }, REFRESH_TIME*1000); 

    // Cleanup the interval on component unmount
    return () => {
      if (refreshInterval) {
        clearInterval(refreshInterval);
      }
    };
  }, [sessionStorage.getItem('_token')]);

  useEffect(async () => {
    if (sessionStorage.getItem('_token')) {
      try {
        const userInfo = await axios.post(process.env.REACT_APP_SERVER_IP+'api/user/info', {
          access_token: sessionStorage.getItem('_token'),
        });

        if (userInfo.data.user) {
          const { username, email, profilePicture, bio, firstname, lastname,_id,savedAudios } =
            userInfo.data.user;

          const userAudioposts = userInfo.data.userAudioposts;  
          
          dispatch(
            loginUser({
              id:_id,
              username,
              email,
              profilePicture,
              bio,
              firstname,
              lastname,
              userAudioposts,
              savedAudios
            })
          );
        }
      } catch (err) {
        // If an error occurs during user info retrieval, log out the user
        sessionStorage.clear();
        dispatch(logoutUser());
        window.location='/';
      }
      dispatch(setLoading(false));
    }else{
      dispatch(setLoading(false));
    }

    
  }, [sessionStorage.getItem('_token')]);
  
  const [backendConnected, setbackendConnected] = useState(true);

  return (

    <main>
      <Toaster />
      {backendConnected&&<Routes>
       <Route path='*' element={<Home />} />
       <Route path='/signin' element={<Auth><SignIn /></Auth>} />
       <Route path='/signup' element={<Auth><SignUp /></Auth>} />
     </Routes>}
     {!backendConnected&&<NoServer></NoServer>}
    </main>
  );
}

export default App;
