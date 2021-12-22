import {  useState  } from 'react';
import {useNavigate} from "react-router-dom";
import {signup} from '../api.js';

const Signup = () => {
    const Navigate = useNavigate();
    const [form, setform] = useState({name:'',email:'',password:'',confirmPassword:"",age:""});
    const handleSubmitSignup = async (e) => {
        e.preventDefault();
        if(!form.name || !form.email || !form.password || !form.confirmPassword || !form.age){ return alert("Something is Empty, Please check your wallet.")};
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
        <div style={{display:'flex',justifyContent:'center',alignItems:'center',width:'100%',height:'50vh', flexDirection:'column'}}>
            <h2>Sign Up</h2>
            <div>
                <label for="name">Name :</label><br/>
                <input id="name" type="text" placeholder='Your Name' onChange={(e)=>(setform({...form, name: e.target.value}))} /><br/>
                <label for="age">Age :</label><br/>
                <input id="age" type="number" placeholder='Age' onChange={(e)=>(setform({...form, age: e.target.value}))} /><br/>
                <label for="email">Email :</label><br/>
                <input id="email" type="email" placeholder='Your email' onChange={(e)=>(setform({...form, email: e.target.value}))} /><br/>
                <label for="pass">Password :</label><br/>
                <input id="pass" type="password" placeholder='Password' onChange={(e)=>(setform({...form, password: e.target.value }))} /><br/>
                <label for="cpass">Confirm Password :</label><br/>
                <input id="cpass" type="password" placeholder='Confirm password' onChange={(e)=>(setform({...form, confirmPassword : e.target.value}))} /><br/><br/>
                <button onClick={handleSubmitSignup} >Submit</button>
            </div>
        </div>
    )
}

export default Signup;
