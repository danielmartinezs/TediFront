import axios from 'axios';

export default axios.create({
    baseURL: 'localhost:127.0.0.1:3306'
});