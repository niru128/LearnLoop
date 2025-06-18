import express from 'express';
import { getMesagesForUser, getMessagesForSwap, getMessagesWithUser, sendMessage } from '../controllers/MessageController.js';
import {verifyToken} from '../middlewares/AuthMiddleware.js'

const router = express.Router();

router.post('/send',verifyToken,sendMessage)
router.get('/',verifyToken,getMesagesForUser);
router.get('/swaps/:swapId',verifyToken, getMessagesForSwap);
// Get messages between current user and another user
router.get('/:otherUserId', verifyToken, getMessagesWithUser);

export default router;