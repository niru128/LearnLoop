import Message from '../models/Message.js';

export const sendMessage = async (req , res)=>{

    try{

        const {receiverId , content, swapRequest} = req.body;

        const message = await Message.create ({
            sender : req.user._id,
            receiver : receiverId,
            content,
            swapRequest : swapRequest || null,
        })

        res.status(201).json(message); 

    }catch(error) {
        console.error('Error creating message:', error);
        res.status(500).json({ message: 'Internal server error' });
    }   
}

export const getMesagesForUser = async (req,res)=>{
    try{

        const messages = await Message.find({
            $or : [
                {sender : req.user._id},
                {receiver : req.user._id}
            ]   
        }).sort({createdAt : 1}).populate('sender', 'name email')
        .populate('receiver', 'name email')

        res.status(200).json(messages);
        
    }catch(error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export const getMessagesForSwap = async (req, res)=>{
    try{

        const {swapId} = req.params;
        const messages = await Message.find({
            swapRequest: swapId
        }).sort({createdAt: 1})
        .populate('sender', 'name email')
        .populate('receiver', 'name email');

        res.status(200).json(messages); 

    }catch(error) {
        console.error('Error fetching messages for swap:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export const getMessagesWithUser = async (req, res) => {
  try {
    const { otherUserId } = req.params;
    const userId = req.user._id;

    const messages = await Message.find({
      $or: [
        { sender: userId, receiver: otherUserId },
        { sender: otherUserId, receiver: userId }
      ]
    }).sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (error) {
    console.error('Error fetching direct messages:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
