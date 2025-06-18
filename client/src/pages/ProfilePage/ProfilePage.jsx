import { Button } from '@/components/ui/button';
import useAuthStore from '@/store/authStore';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { toast } from 'sonner';

const ProfilePage = () => {

    const { userId } = useParams();
    const { token } = useAuthStore();
    const [user, setUser] = useState(null);

    useEffect(() => {
        console.log("userId ", userId)
        const fetchUser = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/users/${userId}`,
                    {
                        headers: { Authorization: `Bearer ${token}` }
                    }
                );
                console.log("User response : ", res.data)
                setUser(res.data);
            } catch (error) {
                toast.error("Failed to laod user Profile")
            }
        }
        fetchUser();
    }, [userId, token]);

    if (!user) return <div className='p-4 text-center'>Loading Profile...</div>
    return (
        <div className='min-h-screen flex items-center justify-center bg-gradient-to-bl from-blue-100 via-purple-100 to-pink-100 '>

            <div className='w-full max-w-md p-6 border-4 rounded shadow bg-white space-y-4'>
                <h1 className='text-2xl font-semibold text-center'>{user.name}</h1>
                <p><strong>Email : </strong> {user.email}</p>
                <p><strong>Location : </strong> {user.location?.city}</p>
                <p><strong>Offers : </strong> {user.skillsOffered}</p>
                <p><strong>Wants : </strong> {user.skillsWanted}</p>
                <Button className="cursor-pointer" onClick={() => toast.error("Edit profile")}>Edit</Button>
            </div>
        </div>
    )
}

export default ProfilePage
