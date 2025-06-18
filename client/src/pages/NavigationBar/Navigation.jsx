import { Button } from '@/components/ui/button';
import useAuthStore from '@/store/authStore';
import React from 'react'
import { Link, useNavigate } from 'react-router-dom'

const Navigation = () => {

    const navigate = useNavigate();
    const { user } = useAuthStore();
    const logout = useAuthStore((state) => state.logout);

    const handleLogout = () => {
        logout();
        localStorage.removeItem("token");
        navigate("/login")
    }


    return (
        <nav className=' sticky top-0 z-50 bg-white shadow-md p-4 justify-between items-center flex'>
            <Link to="/dashboard">

                <h1 className='text-xl font-bold text-blue-500 cursor-pointer'>LearnLoop</h1>
            </Link>
            <div className='space-x-10'>
                <Link to="/dashboard" className='text-gray-700 hover:text-blue-600'>Dashboard</Link>
                <Link to="/chat" className='text-gray-700 hover:text-blue-600'>Message</Link>
                <Link to="/profile" className='text-gray-700 hover:text-blue-600'>Profile</Link>
            </div>
            <Button className="bg-red-600 text-white font-semibold hover:underline cursor-pointer " onClick={() => handleLogout()}>Logout</Button>

        </nav>
    )
}

export default Navigation
