import SwapRequest from '../models/SwapRequest.js';

export const createSwapRequest = async (requestAnimationFrame, res) => {

    try {

        const { responsder, skillOffered, skillsRequested, scheduledDate, message } = req.body;

        const newSwapRequest = await SwapRequest.create({
            requester: req.user._id,
            responsder,
            skillOffered,
            skillsRequested,
            scheduledDate,
            message
        })

        res.status(201).json(newSwapRequest);

    } catch (error) {
        console.error('Error creating swap request:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export const getSwapRequests = async (req, res) => {

    try {

        const swaps = await SwapRequest.find({
            $or: [{ requester: req.user._id }, { responder: req.user._id }]
        }).populate('requester', 'name email')
            .populate('responder', 'name email')

        res.status(200).json(swaps);

    } catch (error) {
        console.error('Error fetching swap requests:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export const updateSwapRequest = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const validStatus = ['pending', 'accepted', 'rejected', 'completed']
        if(!validStatus.includes(status)){
            return res.status(400).json({ message: 'Invalid status' });
        }

        const swapRequest = await SwapRequest.findByIdAndUpdate( id , {status}, { new: true });
        if (!swapRequest) {
            return res.status(404).json({ message: 'Swap request not found' });
        }

        return res.status(200).json(swapRequest);
    }catch (error) {
        console.error('Error responding to swap request:', error);
        res.status(500).json({ message: 'Internal server error' });
    }   

    
}

export const updateRequestStatus = async(req, res)=>{
    try{

        const {requestId} = req.params;
        const {status} = req.body;

        const validStatus = ['accepted' , 'rejected' , 'pending'];

        if(!validStatus.includes(status)){
            return res.status(400).json({message : "INvalid status"})
        }

        const request = await SwapRequest.findByIdAndUpdate(
            requestId,
            {status},
            {new : true}
        );

        if(!request){
            return res.status(400).json({message : "Request not found"});
        }

        res.status(200).json({message : "status updated", request});

    }catch(error){
        console.log(error);
        res.status(500).json({message : "Failed to update request"});
    }
}