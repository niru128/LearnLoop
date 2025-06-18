import { Button } from '@/components/ui/button';
import useAuthStore from '@/store/authStore'
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner';
import Navigation from '../NavigationBar/Navigation';

const SwapRequests = () => {


    const { token } = useAuthStore();
    const [sentRequests, setSentRequests] = useState([]);
    const [receivedRequests, setReceivedRequests] = useState([]);

    useEffect(() => {

        const fetchRequests = async () => {
            try {

                const response = await axios.get("http://localhost:5000/api/connect/requests", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                setSentRequests(response.data.sentRequests || []);
                setReceivedRequests(response.data.receivedRequests || []);

            } catch (err) {
                console.log(err);
                toast.error("Failed to load requests");
            }
        };

        fetchRequests();
    }, [token]);


    const handleStatusUpdate = async (requestId, newStatus) => {
        try {

            const res = await axios.patch(`http://localhost:5000/api/swaps/update-status/${requestId}`, { status: newStatus }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            toast.success("Status updated successfully")


        } catch (error) {

        }
    }

    return (

        <>
            <Navigation />
            <div className='p-6 bg-gray-500 space-y-6'>
                <h1 className='text-2xl font-bold text-white pl-3 mt-1'>Your Requests</h1>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-6 p-4 '>

                    {/*  sent requests */}


                    <div className='bg-blue-200 p-6'>
                        <h2 className='text-2xl font-semibold mb-4'>Sent Requests</h2>
                        <div className='h-[450px] overflow-y-auto pr-2 space-y-4'>

                        {sentRequests.length == 0 ? (
                            <p className='text-gray-500'>No Sent Requests</p>

                        ) : (
                            <div className='space-y-4'>
                                {sentRequests.map((req) => (
                                    <div key={req._id} className='p-4 bg-white rounded shadow'>
                                        <p><strong>To:</strong>{req.responder.name}</p>
                                        <p><strong>offers:</strong>{req?.responder?.skillsOffered?.join(',') || '-'}</p>
                                        <p><strong>Wants:</strong>{req?.responder?.skillsWanted?.join(',')}</p>
                                        <p><strong>Location:</strong>{req?.responder?.location?.city || '-'}</p>
                                        <p>
                                            <strong>Status:</strong>{" "}
                                            <span className={`font-semibold ${req.status === 'accepted' ? 'text-green-600' : req.status === 'rejected' ? 'text-red-600' : 'text-yellow-600'
                                                }`}>
                                                {req.status}
                                            </span>
                                        </p>

                                    </div>
                                ))}
                            </div>
                        )}
                        </div>
                    </div>


                    {/* Recieved Request */}
                    <div className='bg-blue-200 p-6'>
                        <h2 className='text-2xl font-semibold mb-4' >Received Requests</h2>
                        <div className='space-y-4 overflow-y-auto h-[450px] pr-2'>

                        {
                            receivedRequests.length === 0 ? (
                                <p>No Received Requests</p>
                            ) : (
                                <div className='space-y-4' >
                                    {receivedRequests.map((req) => (
                                        <div key={req._id} className='p-4 bg-white rounded shadow'>

                                            <p><strong>From:</strong>{req?.requester?.name}</p>
                                            <p><strong>Offers:</strong>{req?.requester?.skillsOffered?.join(',') || '-'}</p>
                                            <p><strong>Wants:</strong>{req?.requester?.skillsWanted?.join(',') || '-'}</p>
                                            <p><strong>location:</strong>{req?.requester?.location?.city || '-'}</p>
                                            <p>
                                                <strong>Status:</strong>{" "}
                                                <span className={`font-semibold ${req.status === 'accepted' ? 'text-green-600' : req.status === 'rejected' ? 'text-red-600' : 'text-yellow-600'
                                                    }`}>
                                                    {req.status}
                                                </span>
                                            </p>

                                            {
                                                req.status === 'pending' && (
                                                    <div className='flex gap-2 pt-2'>
                                                        <Button onClick={() => handleStatusUpdate(req._id, 'accepted')} className="bg-green-500 text-white px-3 py-1 rounded cursor-pointer">Accept</Button>

                                                        <Button onClick={() => handleStatusUpdate(req._id, 'rejected')} className="bg-red-500 text-white px-3 py-1 rounded cursor-pointer ">Reject</Button>

                                                    </div>
                                                )
                                            }
                                        </div>
                                    ))}
                                </div>
                            )
                        }
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default SwapRequests
