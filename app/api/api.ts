import axios from 'axios';

export const api = axios.create({
  baseURL: 'https://speedhub-back.onrender.com/api',
  withCredentials: true,
});