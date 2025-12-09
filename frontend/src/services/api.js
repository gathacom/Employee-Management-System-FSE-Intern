import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api', 
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(
  (response) => response, 
  (error) => {
    const message = error.response?.data?.message || 'Something went wrong';
    
    console.error('API Error:', message);
    
    return Promise.reject(new Error(message));
  }
);

export default api;