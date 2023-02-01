import axios from "axios";

const getBaseUrl = () => {
    let url;
    switch(process.env.NODE_ENV) {
      case 'production':
        url = 'https://mystore-z24h.onrender.com';
        break;
      case 'development':
      default:
        url = 'http://127.0.0.1:5000';
    }
  
    return url;
  }
  
  export default axios.create({
    baseURL: getBaseUrl(),
  });