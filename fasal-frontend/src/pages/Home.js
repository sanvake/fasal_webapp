import {useState} from "react";
import { searchMovies, getMyList } from "../api.js";
import {useNavigate} from "react-router-dom";

const Home = () => {
    const [user, setUser] = useState(localStorage.getItem("token"));
    const [search,setsearch] = useState("");
    const [movies, setMovies] = useState([]);
    const [list, setList] = useState([]);
    const [listOpen, setListOpen] = useState(false);
    const Navigate = useNavigate();

    const handleSearch = async (e) => {
        try {
            const {data} = await searchMovies(search);
            return setMovies(data?.Search);
        } catch (error) { }
    }

    const getMyListF = async (e) => {
        try {
            const {data} = await getMyList();
            console.log(data);
            setList(data?.list);
            setListOpen(true);
            return;
        } catch (error) {console.log(error) }
    };

    return (
        <div style={{position:'relative'}} >
            { !user ? <button style={{position:'absolute',top:'10px',right:'10px',maxWidth:'120px'}} onClick={()=>{(Navigate('/login'))}}>Login</button>
            :
            <button style={{position:'absolute',top:'10px',right:'10px',maxWidth:'120px'}} onClick={()=>{localStorage.clear();alert("You have been logged out.");setUser(null);}}>Logout</button>}
            <button style={{position:'absolute',top:'10px',right:'150px',maxWidth:'120px'}} onClick={()=>{(Navigate('/user'))}}>User</button>
            <div style={{display:'flex',width:"100vw",justifyContent:'center', marginTop:'90px', flexDirection:'column', alignItems:'center'}} >
                <div style={{maxWidth:'800px', display:'flex',flexDirection:'column',alignItems:'center'}} >
                <h1>Search Movies</h1><br/>
                <input type="text" value={search} onChange={(e)=>(setsearch(e.target?.value))}
                placeholder="Search Movies" 
                style={{borderRadius:'100px',padding:'10px 20px 10px 20px',backgroundColor:"#313131",boxShadow:'9px 14px 22px rgba(0, 0, 0, 0.25)', color:'#fafafa', width:"100%", fontSize:'18px'}}/>
                <br/>
                <button onClick={()=>(handleSearch())} style={{maxWidth:'120px'}} >GO</button>
                </div>
                <br/><br/>
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr 1fr',gap:'20px'}} >
                {movies?.map((m, i)=>(
                    <div style={{borderRadius:'8px',maxWidth:'210px'}} key={i} >
                    <img src={m?.Poster} width="100%" style={{borderRadius:'8px', maxHeight:"290px", objectFit:'cover'}} />
                    <h3>{m?.Title}</h3>
                    <p>{m?.Year}</p>
                    <button onClick={()=>(getMyListF())} >Add to my wishlist</button>
                    </div>
                ))}
                </div>
            </div>
        {listOpen && 
        <div></div>
        }
        </div>
    )
}

export default Home;
