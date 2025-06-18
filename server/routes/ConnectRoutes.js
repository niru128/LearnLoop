import express from 'express';
import { verifyToken } from '../middlewares/AuthMiddleware.js';
import { getAllUserRequests, getSentConnectRequests, sendConnectRequest } from '../controllers/ConnectController.js';

const router  = express.Router();


router.post('/send',verifyToken,sendConnectRequest)
router.get('/requests',verifyToken,getAllUserRequests)
router.get('/sent',verifyToken,getSentConnectRequests)

export default router;