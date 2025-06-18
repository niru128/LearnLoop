import useAuthStore from '@/store/authStore';
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import Navigation from '../NavigationBar/Navigation';

const DashBoard = () => {
  const { token } = useAuthStore();
  const [users, setUsers] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersRes = await axios.get('http://localhost:5000/api/users/', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const sentRes = await axios.get('http://localhost:5000/api/connect/sent', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        setUsers(usersRes.data?.users || []);
        setSentRequests(sentRes.data?.sentRequests || []);
      } catch (err) {
        console.error("Error fetching data:", err);
        toast.error("Failed to fetch data");
      }
    };

    if (token) fetchData();
  }, [token]);

  const handleConnect = async (receiverId) => {
    try {
      await axios.post("http://localhost:5000/api/connect/send", { receiverId }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      toast.success("Connection request sent!");

      setSentRequests(prev => [
        ...prev,
        { id: receiverId.toString(), status: 'pending' }
      ]);
    } catch (err) {
      if (err.response?.data?.message === "Connection already send") {
        setSentRequests(prev => [
          ...prev,
          { id: receiverId.toString(), status: 'pending' }
        ]);
        toast.info("Connection already sent.");
      } else {
        toast.error("Error sending request");
      }
    }
  };

  return (
    <>
      <Navigation />
      <div className="p-6 min-h-screen bg-gray-400">
        <h1 className="text-3xl font-bold mb-4 text-white">Find a SkillSwap Partner</h1>

        <Link to="/swap-requests">
          <Button className="mb-6 px-4 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700">
            View Requests
          </Button>
        </Link>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.isArray(users) && users.map((u) => {
            const userStatus = sentRequests.find(r => r.id === u._id);
            const isPending = userStatus?.status === 'pending';
            const isConnected = userStatus?.status === 'accepted';

            return (
              <div key={u._id} className="bg-white p-5 rounded-2xl shadow-md hover:shadow-lg transition">
                <div className='flex space-x-4 items-center mb-1'>
                  <img src={u.pic} alt='avatar' className='w-10 h-10 rounded-full' />
                  <h2 className="text-xl font-bold text-gray-800">{u.name}</h2>
                </div>
                <p className="text-gray-700 mb-1">
                  <strong>Offers:</strong> {u.skillsOffered.join(', ')}
                </p>
                <p className="text-gray-700 mb-1">
                  <strong>Wants:</strong> {u.skillsWanted.join(', ')}
                </p>
                <p className="text-gray-700 mb-4">
                  <strong>Location:</strong> {u.location?.city || '-'}
                </p>

                <div className="flex flex-wrap gap-2">
                  <Button
                    className={`px-3 py-1 text-white rounded ${isConnected ? 'bg-emerald-600' : isPending ? 'bg-blue-600' : 'bg-gray-700'} hover:opacity-90`}
                    onClick={() => handleConnect(u._id)}
                    disabled={isPending || isConnected}
                  >
                    {isConnected ? 'Connected' : isPending ? 'Request Sent' : 'Connect'}
                  </Button>

                  <Link to={`/chat/${u._id}`}>
                    <Button className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700">
                      Message
                    </Button>
                  </Link>

                  <Link to={`/profile/${u._id}`}>
                    <Button className="px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700">
                      View Profile
                    </Button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default DashBoard;
