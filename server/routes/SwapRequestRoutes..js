
import express from 'express';
import { createSwapRequest, getSwapRequests,updateRequestStatus,updateSwapRequest } from '../controllers/SwapRequestController.js';
import {verifyToken} from '../middlewares/AuthMiddleware.js';

const router = express.Router();

// Create a new swap request

router.post('/',verifyToken, createSwapRequest);
router.get('/', verifyToken, getSwapRequests);
router.patch('/:id/status', verifyToken, updateSwapRequest);
router.patch('/update-status/:requestId',verifyToken,updateRequestStatus);


export default router;