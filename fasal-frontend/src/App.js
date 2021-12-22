import {Routes, Redirect, Route} from 'react-router-dom';
import Auth from "./pages/auth.js";
import Home from "./pages/Home.js";
import Signup from "./pages/Signup.js";
import { useState } from 'react';

const App = ()=> {

  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));

  return (
    <div>
        <Routes>
            <Route path="/" exact element={<Home/>}/>
            <Route path="/login" exact element={<Auth/>} />
            <Route path="/signup" exact element={<Signup/>} />
        </Routes>
    </div>
  );
}

export default App;