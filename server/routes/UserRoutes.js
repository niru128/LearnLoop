import express from 'express';
import { verifyToken } from '../middlewares/AuthMiddleware.js';
import { getAllUsers,getUserById,updateProfile } from '../controllers/UserController.js';

const router = express.Router();

router.get('/',verifyToken , getAllUsers)
router.put('/profile',verifyToken,updateProfile);
router.get('/:id', verifyToken, getUserById);


export default router;