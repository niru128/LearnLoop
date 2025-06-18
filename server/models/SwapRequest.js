import mongoose from "mongoose";

const swapRequestSchema = new mongoose.Schema({
    requester : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required : true
    },
    responder : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required : true
    },
    skillOffered : [{
        type : String,
        required : true,
        trim : true
    }],
    skillsRequested : [{
        type : String,
        required : true,
        trim : true
    }],
    status : {
        type : String,
        enum : ['pending', 'accepted', 'rejected', 'completed'],
        default : 'pending'
    },
    scheduledDate : {
        type : Date,
    },
    message : {
        type : String,
        trim : true
    }
},{
    timestamps: true
})

const SwapRequest = mongoose.model('SwapRequest', swapRequestSchema);
export default SwapRequest;