import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import useAuthStore from '../../store/authStore';
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner"
import axios from 'axios';

const Register = () => {

    const [formData, setFormData] = useState({name : '', email: '', password: ''});
    const setAuth = useAuthStore((state)=> state.setAuth);
    const navigate = useNavigate();
    

    const handleRegister = async (e)=>{
        e.preventDefault();
        
        try{

            if(!formData.name || !formData.email || !formData.password){
                toast.error("Please fill in all fields.");
                return;
            }

            const response = await axios.post("http://localhost:5000/api/auth/register", formData);

            const token = response.data.token;
            const user = response.data.user;
            setAuth({token, user});
            toast.success("Registration successful!");
            navigate("/");

        }
        catch(error){
            toast.error("Registration failed. Please try again.")
            console.error("Registration error:", error);
        }
    }
  return (
    
      <div className='flex flex-col items-center justify-center h-screen bg-amber-200 '>
            <h1 className='mt-20 font-bold text-5xl text-blue-700'>Welcome to LearnLoop</h1>
			<form onSubmit={handleRegister} className='w-1/2 h-auto  m-auto p-6 bg-white rounded-lg shadow-lg space-y-10  text-center justify-center flex flex-col mt-4 '>
				<h2 className='text-4xl font-bold'>Register</h2>
				<div className='flex flex-col space-y-6'>

				<input
					type="text"
					placeholder='Username'
					value={formData.name}
					onChange={(e) => setFormData({...formData,name : e.target.value})}  
					
					className='border p-3 rounded-lg focus:border-blue-500 active:border-blue-600'
				/>
                <input
					type="email"
					placeholder='Email'
					value={formData.email}
					onChange={(e) => setFormData({...formData,email : e.target.value})} 
					
					className='border p-3 rounded-lg focus:border-blue-500 active:border-blue-600'
				/>
				<input
					type="password"
					placeholder='Password'
					value={formData.password}
					onChange={(e) => setFormData({...formData,password : e.target.value})} 
					className='border p-3 rounded-lg focus:border-blue-500 active:border-blue-600'
					
				/>
				</div>
				<Button type="submit" className="cursor-pointer">Register</Button>
				<p className='mt-0'>Already a user? <a className='text-blue-600 font-bold' href='/'>Login</a> </p>
			</form>
		</div>
    
  )
}

export default Register
