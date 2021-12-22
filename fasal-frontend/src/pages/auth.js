import { Link } from "react-router-dom";
import {  useState  } from 'react';
import {useNavigate} from "react-router-dom";
import {signin} from '../api.js';


const Auth = () => {
    const Navigate = useNavigate();
    const [form, setform] = useState({email:'',password:''});
    const handleAuthSubmit = async (e) => {
        e.preventDefault();
        if(!form.email || !form.password){ return alert("Enter your details.")};
        try {
            var {data} = await signin( form.email, form.password);
        } catch (error) {
            console.log(error)
        }
            console.log(data)
          if(data?.status===200){
              localStorage.setItem('token', data.auth_token);
              alert("You are now logged in.");
              Navigate('/home');
          }
          else if(data?.status===400){
            alert("User unavailable, Please Sign up.");
            Navigate('/signup');
          }
          else if(data?.status===500){
                alert("Wrong Password, Please try again.");
        }
    }

    return (
        <div style={{display:'flex',justifyContent:'center',alignItems:'center',width:'100%',height:'50vh', flexDirection:'column'}}>
            <h2>Login</h2>
            <div>
                <form onSubmit={handleAuthSubmit} >
                <label for="email">Email :</label><br/>
                <input id="email" type="email" placeholder='Your email' value={form.email} onChange={(e)=>(setform({...form, email: e.target.value}))} /><br/>
                <label for="pass">Password :</label><br/>
                <input id="pass" type="password" placeholder='Password' value={form.password} onChange={(e)=>(setform({...form, password: e.target.value }))} /><br/>
                <button type="submit" >Submit</button>
                </form>
                <div>Dont have an account? <Link to="/signup" >Sign up</Link> instead</div>
                <div>Wanna skip login? go to <Link to="/home" >Home</Link></div>
            </div>
        </div>
    )
}

export default Auth
