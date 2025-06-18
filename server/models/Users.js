import mongoose from "mongoose";
import bcrypt from "bcryptjs";

// User schema for the LearnLoop application
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
        trim: true,
    },
    skillsOffered: [{
        type: String,
        trim: true,
    }],
    skillsWanted: [{
        type: String,
        trim: true,
    }],
    location: {
        city: String,
        state: String,
        country: String
    },
    rating: {
        type: Number,
        default: 0
    },
    numberOfRatings: {
        type: Number,
        default: 0
    },

}, {
    timestamps: true
});

//Hash password before saving

userSchema.pre('save', async function (next) {

    if (!this.isModified('password')) return next();
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
})

//Method to compare password

userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;