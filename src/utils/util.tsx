import axios from "axios";
import { ToastOptions } from 'react-toastify';
import "../assets/css/common.css";

const axiosInstance = axios.create({
  baseURL: "https://dpl-backend-3pdy.onrender.com/api",
  headers: {
    "Content-type": "application/json"
  }
});

// Add a request interceptor to include the Bearer token from localStorage
axiosInstance.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Token expire to logout
axiosInstance.interceptors.response.use(
  response => response,
  error => {
    const { response } = error;
    if (response && response.data && response.data.message === "Token expired") {
      localStorage.clear();

      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;

// toaster configuration
export const notificationConfig: ToastOptions = {
  autoClose: 1000,
  position: "top-right",
  hideProgressBar: true,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: "light",
}

// common date formate
export const dateFormateSql = (data: string) => {
  if (data !== null) {
    const isoDate = new Date(data);
    const year = isoDate.getFullYear();
    const month = String(isoDate.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(isoDate.getDate()).padStart(2, '0');
    const hours = String(isoDate.getHours()).padStart(2, '0');
    const minutes = String(isoDate.getMinutes()).padStart(2, '0');
    const seconds = String(isoDate.getSeconds()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    return formattedDate;
  } else {
    const isoDate = new Date();
    const year = isoDate.getFullYear();
    const month = String(isoDate.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(isoDate.getDate()).padStart(2, '0');
    const hours = String(isoDate.getHours()).padStart(2, '0');
    const minutes = String(isoDate.getMinutes()).padStart(2, '0');
    const seconds = String(isoDate.getSeconds()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    return formattedDate;
  }
}

export const biteCodeConvertIntoImg = (data: any) => {
  if (data.userImg) {
    let uint8Array: any = new Uint8Array(data.userImg.data);
    const base64String = uint8Array.reduce((data: any, byte: any) => data + String.fromCharCode(byte), '');
    return base64String;
  }
  return null;
}

// role base 
export const roles = {
  Admin_Role: "admin",
  User_Role: "user"
}

export const adminHeader = [
  { navigateUrl: '/dashboard', componentName: 'Dashboard' },
  { navigateUrl: '/matches', componentName: 'Matches' },
  { navigateUrl: '/teams', componentName: 'Teams' },
  { navigateUrl: '/users', componentName: 'Users' },
  { navigateUrl: '/prediction-analysis', componentName: 'Prediction Analysis' },
]

export const userHeader = [
  { navigateUrl: '/dashboard', componentName: 'Dashboard' },
  { navigateUrl: '/matches', componentName: 'Matches' },
  { navigateUrl: '/teams', componentName: 'Teams' },
  { navigateUrl: '/prediction-analysis', componentName: 'Prediction Analysis' },
]