import React from 'react';
import {Route,Routes} from 'react-router-dom';
import SignUp from '../pages/SignUp';
import SignIn from '../pages/SignIn';

function AuthRouter(){
      return (
        <Routes>
            <Route path='/signin' element={<SignIn></SignIn>}></Route>
            <Route path='/signup' element={<SignUp></SignUp>}></Route>
        </Routes>
      );
}
export default AuthRouter;