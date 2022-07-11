import axios from "axios";

//export const baseURL = 'http://localhost:4444';
export const baseURL = 'http://95.188.84.114:4444';


const instance = axios.create({baseURL});

//когда происходит любой запрос...
instance.interceptors.request.use(config => {
	//всегда проверять есть ли в localStorage что-то и вшить в Authorization
	config.headers.Authorization = JSON.parse(window.localStorage.getItem('token'));
	
	return config;
})

export default instance;