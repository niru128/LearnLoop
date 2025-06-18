import { Button } from '@/components/ui/button';
import useAuthStore from '@/store/authStore'
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner';
import socket from '@/socket';
import Navigation from '../NavigationBar/Navigation';

const ChatBox = ({ otherUser }) => {

    if (!otherUser || !otherUser._id) {
        return <div>Loading chat...</div>; // or return nothing if appropriate
    }


    const { token, user } = useAuthStore();
    const [messages, setMessages] = useState([]);
    const [content, setContent] = useState('');

    useEffect(() => {

        if (!otherUser?._id) return;
        const fetchMessages = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/messages/${otherUser._id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                setMessages(res.data);
            }
            catch (error) {
                toast.error("Failed to fetch messages");
            }
        }

        fetchMessages();
    }, [otherUser._id, token]);


    useEffect(() => {
        socket.on('receiveMessage', (msg) => {

            //only show messages that are releveant to this chat

            if (msg.sender === otherUser._id || msg.receiver === otherUser._id) {
                setMessages(prev => [...prev, msg]);
            }
        });

        return () => {
            socket.off('receiveMessage');
        }
    }, [otherUser._id]);

    const sendMessage = async () => {
        if (!content.trim()) return;
        try {

            const res = await axios.post("http://localhost:5000/api/messages/send", {
                receiverId: otherUser._id,
                content
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setMessages(prev => [...prev, res.data]);
            socket.emit('sendMessage', res.data);
            setContent('');

        } catch (error) {
            toast.error('Failed to send message');
        }
    }

    return (
        <>
        <Navigation />
        <div className='flex h-screen mt-0.5'>

            {/* sidebar */}
            <div className='w-1/4 bg-white border-r p-4 hidden md:block'>
  
                <p className='text-gray-500 font-bold'>Your LearnLoop Partners</p>

            </div>

            {/* chat section */}

            <div className='flex-1 flex flex-col bg-slate-50'>
                {/* header */}

                <div className='flex items-center gap-3 p-4 bg-white border-b shadow-sm'>
                    <img src={otherUser.pic} alt='avater' className='w-10 h-10 rounded-full' />
                    <h3 className='text-lg font-semibold'>{otherUser.name}</h3>
                </div>

                {/* messages */}
                <div className='flex-1 overflow-y-auto p-4 space-y-2'>
                    {
                        messages.map((msg,i)=>(
                            <div key={i} className={`flex ${msg.sender === user._id ? 'justify-end' : 'justify-start'} `}>
                                <div className={`max-w-xs px-4 py-2 rounded-lg text-sm ${msg.sender === user._id ? 'bg-blue-500 text-white' : 'bg-gray-300 text-black' }`}>
                                    {msg.content}
                                </div>
                            </div>
                        ))
                    }
                </div>

                {/* input */}

                <div className='flex items-center p-4 bg-white border-t'>
                    <input className='flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500' value={content} onChange={(e)=> setContent(e.target.value)} placeholder='Type a message...' onKeyDown={(e)=>e.key === "Enter" && sendMessage()} />
                    <Button onClick={sendMessage} className="ml-2 bg-blue-600 text-white hover:bg-blue-700 cursor-pointer">Send</Button>
                </div>
            </div>
            
        </div>
        </>

        // <div className='p-4 border rounded space-y-2'>

        //     <div className='h-60 overflow-y-auto bg-gray-50 p-2'>
        //         {messages.map((msg, i) => (
        //             <div key={i} className={`text-sm ${msg.sender === otherUser._id ? 'text-left' : 'text-right'}`}>
        //                 <span className='inline-block p-2 bg-blue-100 rounded'>{msg.content}</span>
        //             </div>
        //         ))}
        //     </div>
        //     <div className='flex gap-2'>
        //         <input
        //             className='flex-grow border px-2 py-1 rounded'
        //             value={content}
        //             onChange={(e) => setContent(e.target.value)}
        //             placeholder='Type a message...'
        //         />
        //         <button onClick={sendMessage} className='bg-blue-600 text-white px-4 py-1 rounded'>Send</button>
        //     </div>
        // </div>
    )
}

export default ChatBox
