import { Link } from "react-router-dom";


const Auth = () => {

    const handleAuthSubmit = (e) => {
        console.log(e);
    }

    return (
        <div>
            <h1>Login</h1>
            <form onSubmit={handleAuthSubmit} >
            <input type="email" placeholder="enter username" ></input><br/>
            <input type="password" placeholder="enter password" ></input><br/>
            <button type="submit" >Submit</button>
            </form>
            <div>Dont have an account? <Link to="/signup" >Sign up</Link> instead</div>
            <div>Wanna skip login? go to <Link to="/home" >Home</Link></div>
        </div>
    )
}

export default Auth
