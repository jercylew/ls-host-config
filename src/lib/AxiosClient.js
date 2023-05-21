import axios from 'axios';

const AxiosClient = axios.create({
    //baseURL: 'http://192.168.0.54:3000/api/',
    baseURL: 'http://www.lengshuotech.com:3000/api/',
    timeout: 10000,
    headers: { 'ls-token': '1234567890abcdef' }
});

//- or after instance has been created
// AxiosClient.defaults.headers.post['header1'] = 'value'

//- or before a request is made
// using Interceptors
// AxiosClient.interceptors.request.use(config => {
//   config.headers.post['header1'] = 'value';
//   return config;
// });

export default AxiosClient;