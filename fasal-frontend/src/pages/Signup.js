import {  useState  } from 'react';
import {useNavigate} from "react-router-dom";
import {signup} from '../api.js';

const Signup = () => {
    const Navigate = useNavigate();
    const [form, setform] = useState({name:'',email:'',password:'',confirmPassword:"",age:""});
    const handleSubmitSignup = async (e) => {
        e.preventDefault();
        if(form?.password!==form?.confirmPassword){ return alert("Passord not matching")};
        try {
            var {data} = await signup(form.name, form.email, form.password, form.age);
        } catch (error) {
            console.log(error)
        }
            console.log(data)
          if(data?.status===200){
              alert("User succesfully created, Please Sign in.");
              Navigate('/login');
          }
          else if(data?.status===459){
            alert("User already exists, Please Sign in.");
            Navigate('/login');
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
