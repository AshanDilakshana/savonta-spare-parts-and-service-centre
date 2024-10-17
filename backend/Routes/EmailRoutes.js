import express from 'express';
import { sendConfirmationEmail } from "../Controllers/EmailController.js";

const router = express.Router();

router.post('/send-confirmation-email', sendConfirmationEmail);

export default router;
