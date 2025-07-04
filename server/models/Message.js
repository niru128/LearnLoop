import mongoose from "mongoose";   


const messageSchema = new mongoose.Schema({
    sender : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required: true
    },
    receiver : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required: true  
    },
    content : {
        type : String,
        required: true,
        trim: true  
    },
    swapRequest :{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'SwapRequest',
        
    },
    read : {
        type : Boolean,
        default : false
    }
},{
    timestamps: true
});

const Message = mongoose.model('Message', messageSchema);

export default Message;