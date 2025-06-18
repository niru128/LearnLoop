import User from '../models/Users.js';

export const getAllUsers = async (req, res) => {
	try {

		//exclude the logged in user

		const users = await User.find({ _id: { $ne: req.user._id } })
			.select('name skillsOffered skillsWanted location');

		res.status(200).json({ users });

	}
	catch (err) {
		console.error(err);
		res.status(500).json({ message: 'Internal Server Error' });
	}
}

export const updateProfile = async (req, res) => {
	try {

		const userId = req.user.id;

		const { name, email, skillsOffered, skillsWanted, location } = req.body;

		const updateUser = await User.findByIdAndUpdate(userId, {
			name,
			email,
			skillsOffered,
			skillsWanted,
			location
		}, { new: true });

		if (!updateUser) {
			return res.status(404).json("User not found");
		}

		return res.status(200).json({ user: updateUser })

	}
	catch (error) {
		return res.status(400).json("Error in getting user profile: " + error.message);
	}
}

export const getUserById = async (req, res) => {
	try {
		const user = await User.findById(req.params.id).select('-password');
		if (!user) return res.status(404).json({ message: 'User not found' });
		res.status(200).json(user);
	} catch (err) {
		console.error('Failed to fetch user by ID:', err);
		res.status(500).json({ message: 'Server error' });
	}
};
