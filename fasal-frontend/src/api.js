import axios from 'axios'
const api = axios.create({ baseURL: 'http://localhost:8000' })
export const signup = async (name, email, password, age) => api.post(`/sign-up?name=${name}&email=${email}&age=${age}&password=${password}`)
export const signin = async (email, password) => api.post(`/sign-in?email=${email}&password=${password}`)