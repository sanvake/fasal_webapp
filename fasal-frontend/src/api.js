import axios from 'axios'
const api = axios.create({ baseURL: 'http://localhost:8000/' })
export const signup = async (name, email, password, age) => api.post(`http://localhost:8000/sign-up?name=${name}&email=${email}&age=${age}&password=${password}`)