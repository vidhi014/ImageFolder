// routes/userRoutes.js
import express from 'express';
import { signIn,
  signUp, resetPassword, findUserByEmail, sendOtp, verifyOtp } from './usercontroller.js';

const router = express.Router();

router.post('/signup', signUp);             
router.post('/signin', signIn);
router.post('/reset-password', resetPassword);
router.post('/find-user', findUserByEmail);
router.post('/send-otp', sendOtp);
router.post('/verify-otp', verifyOtp);

export default router;
