// ChatPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';
import useAuthStore from '@/store/authStore';
import ChatBox from './ChatBox';

const ChatPage = () => {
  const { receiverId } = useParams();
  const { token } = useAuthStore();
  const [otherUser, setOtherUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/users/${receiverId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setOtherUser(res.data); // assumes backend returns single user object
      } catch (err) {
        toast.error('Failed to load user');
      }
    };

    if (receiverId) fetchUser();
  }, [receiverId, token]);

  return otherUser ? <ChatBox otherUser={otherUser} /> : <div>Loading chat...</div>;
};

export default ChatPage;
