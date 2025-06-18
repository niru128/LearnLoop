import User from "../models/Users.js";
import jwt from "jsonwebtoken";
import {toast} from "sonner";

const generateToken = (userId) => {
	return jwt.sign({id : userId}, process.env.JWT_SECRET, {
		expiresIn: '7d'
	});
};

//register Controller

export const registerUser = async(req , res) =>{
	try{
		const {name , email , password, skillsOffered, skillsWanted} = req.body;

		const existingUser = await User.findOne({email});

		if(existingUser){
			return res.status(400).json({message: "User already exists"});
		}

		const newUser = await User.create({
			name,
			email,
			password,
			skillsOffered,
			skillsWanted
		});

		const token = generateToken(newUser._id);

		res.status(201).json({
			user:{
				id : newUser._id,
				name: newUser.name,	
				email: newUser.email
			},
			token
		});


	}catch(error){
		res.status(400).json("Error in registering user: " + error.message);
	}
}

//login controller

export const loginUser = async (req, res)=>{
	try{	
		const {email, password}= req.body;

		const user = await User.findOne({email});

		if(!user){
			return res.status(400).json({message: "User does not exist"});
		}

		const isMatch = await user.comparePassword(password);

		if(!isMatch){
			return res.status(400).json("Password is invalid");
		}
		
		const token = generateToken(user._id);

		res.status(201).json({
			user:{
				id : user._id,
				name: user.name,
				email: user.email,
			},
			token
		})

	}catch(error){
		return res.status(400).json("Error in logging in user: " + error.message);
	}
}


