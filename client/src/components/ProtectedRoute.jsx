import useAuthStore from '@/store/authStore'
import React from 'react'
import { useNavigate } from 'react-router-dom';
import Spinner from './Spinner';

const ProtectedRoute = ({children}) => {

    const navigate = useNavigate();
  
    const {token,loading} = useAuthStore();

    if(loading){
        return <Spinner/>
    }

    const isAuthenticated = token || localStorage.getItem("token");

    if(!isAuthenticated){
        return navigate("/");
    }

    return children;
  
}

export default ProtectedRoute
