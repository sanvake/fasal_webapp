import axios from 'axios'
const api = axios.create({ baseURL: 'http://localhost:8000' });

export const searchMovies = async (query) => api.get(`http://www.omdbapi.com/?apikey=9882f1fd&s=${query}`);
export const signup = async (name, email, password, age) => api.post(`/sign-up?name=${name}&email=${email}&age=${age}&password=${password}`);
export const signin = async (email, password) => api.post(`/sign-in?email=${email}&password=${password}`);
export const getMyList = async () => api.get("/getListByUser",  { headers: {"Authorization" : `Bearer ${localStorage.getItem("token")}`} });
export const user = async (user_id) => api.get(`/sign-in?user_id=${user_id}`);