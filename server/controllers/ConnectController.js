import connectRequest from "../models/ConnectRequest.js";
// import User from "../models/Users.js";
import SwapRequest from "../models/SwapRequest.js"
import User from "../models/Users.js";


export const sendConnectRequest = async (req , res)=>{
    try{

        const {receiverId} = req.body;
        const senderId = req.user._id;

        const existing = await connectRequest.findOne({sender : senderId,receiver : receiverId});
        if(existing) return res.status(400).json({message : "Connection already send"});

        const senderUser = await User.findById(senderId);
        const receiverUser = await User.findById(receiverId);

        const connectReq = new connectRequest({sender : senderId , receiver:receiverId});

        const newSwap = new SwapRequest({
            requester : senderId,
            responder : receiverId,
            skillsOffered : senderUser.skillsOffered,
            skillsWanted : receiverUser.skillsWanted,
            message : `Hi ${receiverUser.name}, let's swap skills`,
        });

        await newSwap.save();
        // const request = new connectRequest({sender : senderId,receiver : receiverId});

        // await request.save();


        res.status(200).json({message : "Connection sent"});
    }
    catch(err){
        console.log(err);
        res.status(500).json("Cannot connect");
    }
}

// connect controller
export const getSentConnectRequests = async (req, res) => {
  try {
    const senderId = req.user._id;

    const sent = await connectRequest.find({ sender: senderId })
      .select('receiver status'); // ✅ include status too

    const formatted = sent.map(r => ({
      id: r.receiver.toString(),
      status: r.status // e.g., 'pending' or 'accepted'
    }));

    console.log("Formatted data", formatted)

    res.status(200).json({ sentRequests: formatted });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Could not fetch sent requests" });
  }
};


export const getAllUserRequests = async(req,res)=>{
    try{

        const userId = req.user._id;

        const sent = await SwapRequest.find({requester : userId}).populate('responder','name skillsOffered skillsWanted location');
        const received  =  await SwapRequest.find({responder : userId}).populate('requester','name skillsOffered skillsWanted location');
        res.status(200).json({
            sentRequests : sent,
            receivedRequests : received,
        });
    }
    catch(err){
        console.log(err);
        res.status(500).json({message : "Requests cannot be found"})
    }
}