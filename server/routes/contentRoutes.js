import express from 'express';
import { 
  submitContactForm,
  getWebsiteContent,
  updateWebsiteContent
} from '../controllers/contentController.js';

const router = express.Router();

router.post('/contact', submitContactForm);

router.route('/')
  .get(getWebsiteContent)
  .post(updateWebsiteContent);

export default router;