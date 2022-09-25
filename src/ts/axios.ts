import axios from 'axios';
import { AxiosRequestHeaders } from 'axios'

const baseURL = 'http://www.illtamer.com/api';
const token = localStorage.getItem('token');

const headers: AxiosRequestHeaders = {
    'Content-Type': 'application/json;charset=UTF-8',
    'token': token == null ? '' : token
};

const Axios = axios.create({
    baseURL: baseURL,
    timeout: 10000,
    headers: headers
});

Axios.interceptors.request.use(config => {
    // console.log('Request URL: ', config.url);
    return config;
});
Axios.interceptors.response.use(response => {
    // console.log('Response data: ', response.data)
    return response;
}, error => {
    console.error('Response error: ', error);
    return Promise.reject(error)
});

export { Axios, headers }