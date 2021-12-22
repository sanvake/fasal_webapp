import {  useState  } from 'react';
import {Navigate} from "react-router-dom";

const Signup = () => {
    const [form, setform] = useState({name:'',email:'',password:'',confirmPassword:"",age:""});
    const handleSubmitSignup = async (e) => {
        e.preventDefault();
        if(form?.password!==form?.confirmPassword){ return alert("Passord not matching")};
        const response = await fetch(`127.0.0.1:8000/sign-up?name=${form?.name}&email=${form?.email}&age=${form.age}&password=${form.password}`, {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            headers: {
              'Content-Type': 'application/json'
            },
            referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
          });
          if(response?.status===200){
              alert("User succesfully created, Please Sign in.");
              Navigate({to:'/login'});
          }
    }

    return (
        <div>
                <span>name : <input type="text" placeholder='Your Name' onChange={(e)=>(setform({...form, name: e.target.value}))} /></span><br/>
                <input type="email" placeholder='Your email' onChange={(e)=>(setform({...form, email: e.target.value}))} /><br/>
                <input type="password" placeholder='Password' onChange={(e)=>(setform({...form, password: e.target.value }))} /><br/>
                <input type="password" placeholder='Confirm password' onChange={(e)=>(setform({...form, confirmPassword : e.target.value}))} /><br/>
                <input type="number" placeholder='Age' onChange={(e)=>(setform({...form, age: e.target.value}))} /><br/>
                <button onClick={handleSubmitSignup} >Submit</button>
        </div>
    )
}

export default Signup;
