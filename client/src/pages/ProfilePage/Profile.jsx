import { Button } from '@/components/ui/button';
import useAuthStore from '@/store/authStore'
import React, { useState } from 'react'
import { toast } from 'sonner';
import { useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Profile = () => {

    const navigate = useNavigate();
    const {token,user,setAuth} = useAuthStore();
    const [formData, setFormData]= useState({
        name : '',
        email : '',
        skillsOffered : '',
        skillsWanted  : '',
        location : {
            city: '',
            state: '',
            country: ''
        }
    });

    useEffect(()=>{

        if(user){
            setFormData({
                name : user.name || "",
                email : user.email || "",
                skillsOffered : (user.skillsOffered || []).join(','),
                skillsWanted : (user.skillsWanted || []).join(','),
                location :{  city: user.location?.city || '', state: user.location?.state || '',country: user.location?.country || '',}
            })
        }

    },[user]);

    const handleChange = (e) => {
    const { name, value } = e.target;

    // Handle nested location fields
    if (['city', 'state', 'country'].includes(name)) {
        setFormData((prevFormData) => ({
            ...prevFormData,
            location: {
                ...prevFormData.location,
                [name]: value
            }
        }));
    } else {
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value
        }));
    }
};


    const handleUpdate = async (e)=>{

        e.preventDefault();

        try{
            const updatedData = {
                ...formData,
                skillsOffered : formData.skillsOffered.split(',').map(skill => skill.trim()),
                skillsWanted : formData.skillsWanted.split(',').map(skill => skill.trim()),
            }

            const response = await axios.put("http://localhost:5000/api/users/profile", updatedData, {
                headers : {
                    Authorization : `Bearer ${token}`
                }
            })

            setAuth({
                token, user:response.data.user
            });
            toast.success("Profile updated successfully!");
            navigate('/dashboard');
            

        }catch(err){
            toast.error("Failed to update profile. Please try again.");
            console.error("Error updating profile:", err);
            // Optionally, you can show an error message to the user
        }
    }

    
    return (
        <div className='flex flex-col items-center justify-center h-screen bg-amber-200'>
            <h2 className='font-bold text-4xl'>Edit Profile</h2>
            <form onSubmit={handleUpdate} className='w-1/2 h-auto mx-auto p-8 bg-white rounded-lg shadow-lg space-y-6 text-center justify-center flex flex-col mt-4'>
                <input type="text" name='name' value={formData.name} placeholder='Name' onChange={handleChange} className='p-4 focus:border-blue-500 border-blue-300 outline-blue-300 outline-1 rounded-lg'  />
                <input type="email" name='email' value={formData.email} placeholder='Email' onChange={handleChange} className='p-4 focus:border-blue-500 border-blue-300 outline-blue-300 outline-1 rounded-lg' />
                <input type="text" name='skillsOffered' value={formData.skillsOffered} placeholder='Skills Offered (comma separated)' onChange={handleChange} className='p-4 focus:border-blue-500 border-blue-300 outline-blue-300 outline-1 rounded-lg' />
                <input type="text" name='skillsWanted' value={formData.skillsWanted} placeholder='Skills Wanted (comma separated)' onChange={handleChange} className='p-4 focus:border-blue-500 border-blue-300 outline-blue-300 outline-1 rounded-lg' />
                <input type="text" name='city' value={formData.location.city} placeholder='City' onChange={handleChange} className='p-4 focus:border-blue-500 border-blue-300 outline-blue-300 outline-1 rounded-lg' />
                <input type="text" name='state' value={formData.location.state} placeholder='state' onChange={handleChange} className='p-4 focus:border-blue-500 border-blue-300 outline-blue-300 outline-1 rounded-lg' />
                <input type="text" name='country' value={formData.location.country} placeholder='country' onChange={handleChange} className='p-4 focus:border-blue-500 border-blue-300 outline-blue-300 outline-1 rounded-lg' />
                <Button type='submit' className="cursor-pointer">Update</Button>
            </form>
        </div>
    )
}

export default Profile
