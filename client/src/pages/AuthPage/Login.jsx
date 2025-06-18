import React, { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import axios from 'axios';
import useAuthStore from '../../store/authStore';
import { useNavigate } from 'react-router-dom';
import { set } from 'mongoose';


const Login = () => {

	// useEffect(()=>{
	// 	toast('sonner is ready!');
	// })

	const [email, setEmail] = useState();
	const [password, setPassword] = useState();
	const setAuth = useAuthStore((state) => state.setAuth);
	const setLoading = useAuthStore((state) => state.setLoading);
	const navigate = useNavigate();

	// const handleLogin = async (e) => {
	// 	e.preventDefault();
	// 	console.log("Login button clicked");
	// 	setLoading(true); // Set loading to true when login starts


	// 	try {

	// 		if (!email || !password) {
	// 			toast.error("Please fill in all fields.");
	// 			return;
	// 		}

	// 		const response = await axios.post("http://localhost:5000/api/auth/login", { email, password });
	// 		const token = response.data.token;
	// 		const user = response.data.user;
	// 		setAuth({ token, user });
	// 		localStorage.setItem("token", token);


	// 		toast.success("Login successful!");
	// 		console.log("Logged in user", user)
	// 		if (!user.skillsOffered?.length ||
	// 			!user.skillsWanted?.length ||
	// 			!user.location?.city || 
	// 			!user.location?.state ||
	// 			!user.location?.country) {
	// 			navigate("/profile");
	// 		} else {

	// 			navigate("/dashboard");
	// 		}

	// 	}
	// 	catch (error) {
	// 		toast.error("Login failed. Please try again.")
	// 		console.error("Login error:", error);
	// 	} finally {
	// 		setLoading(false); // Set loading to false when login ends
	// 	}
	// }

	const handleLogin = async (e) => {
		e.preventDefault();
		setLoading(true);

		try {
			if (!email || !password) {
				toast.error("Please fill in all fields.");
				return;
			}

			// 1. Login user
			const response = await axios.post("http://localhost:5000/api/auth/login", { email, password });
			const token = response.data.token;
			const basicUser = response.data.user;

			// 2. Fetch full profile
			const profileRes = await axios.get(`http://localhost:5000/api/users/${basicUser.id}`, {
				headers: { Authorization: `Bearer ${token}` },
			});
			const fullUser = profileRes.data;

			// 3. Save to Zustand and localStorage
			setAuth({ token, user: fullUser });
			localStorage.setItem("token", token);

			toast.success("Login successful!");

			// 4. Check profile completeness
			const isIncomplete =
				!fullUser.skillsOffered?.length ||
				!fullUser.skillsWanted?.length ||
				!fullUser.location?.city ||
				!fullUser.location?.state ||
				!fullUser.location?.country;

			navigate(isIncomplete ? "/profile" : "/dashboard");

		} catch (error) {
			toast.error("Login failed. Please try again.");
			console.error("Login error:", error);
		} finally {
			setLoading(false);
		}
	};


	return (
		<div className='flex flex-col items-center justify-center h-screen bg-amber-200'>
			<h1 className='mt-5 font-bold text-5xl text-blue-700'>Welcome to LearnLoop</h1>
			<form onSubmit={handleLogin} className='w-1/2 h-auto   mx-auto p-6 bg-white rounded-lg shadow-lg space-y-10  text-center justify-center flex flex-col mt-4'>
				<h2 className='text-4xl font-bold'>Login</h2>
				<div className='flex flex-col space-y-6'>

					<input
						type="email"
						placeholder='Email'
						value={email}
						onChange={(e) => setEmail(e.target.value)}

						className='border p-3 rounded-lg focus:border-blue-500 active:border-blue-600'
					/>
					<input
						type="password"
						placeholder='Password'
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						className='border p-3 rounded-lg focus:border-blue-500 active:border-blue-600'

					/>
				</div>
				<Button type="submit" className="cursor-pointer">Login</Button>
				<p className='mt-0'>Don't have an account? <a className='text-blue-600 font-bold' href='/register'>Register</a> </p>
			</form>
		</div>


	)
}

export default Login
