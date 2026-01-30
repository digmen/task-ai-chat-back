import { Router } from 'express';
import * as ChatController from '../controllers/chat.controller.js';
import { requireAuth } from '../middlewares/auth.middleware.js';

const router = Router();

router.use(requireAuth);

router.get('/', ChatController.getChats);          
router.get('/:id', ChatController.getChatHistory); 
router.post('/', ChatController.sendMessage);      

export default router;