// controllers/userController.js
import UserModel  from './user.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { transporter } from "./transporter.js";

dotenv.config();

export const signUp = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) { return res.status(400).json({ message: 'User already exists. Please login.', success: false }); }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new UserModel({ name, email, password: hashedPassword });
    await newUser.save();
    res.status(201).json({ message: "Signup successful", success: true });
  } catch (err) {
    res.status(500).json({ message: "Internal server error", success: false });
  }
};

export const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect)
      return res.status(400).json({ message: "Invalid credentials" });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h', });
    res.status(200).json({ result: user, token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const resetPassword = async (req, res) => {
  const { email, newPassword } = req.body;
  try {
    const user = await UserModel.findOne({ email });
    if (!user) { return res.status(400).json({ message: "User not found" }); }
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    user.password = hashedPassword;
    await user.save();
    res.status(200).json({ message: "Password reset successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const findUserByEmail = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await UserModel.findOne({ email });
    if (user) {
      res.status(200).json({ message: "User found" });
    } else {
      res.status(202).json({ message: "User not found" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const sendOtp = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await UserModel.findOne({ email });
    if (!user) { return res.status(400).json({ message: 'User not found' }); }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    user.otpExpiry = Date.now() + 3600000;
    await user.save();

    const mailOptions = {
      from: process.env.EMAIL,
      to: user.email,
      subject: 'Your OTP Code',
      text: `Your OTP is ${otp}. It will expire in 1 hour.`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res.status(500).json({ message: 'Failed to send email', error: error.message });
      } else {
        return res.status(200).json({ message: 'OTP sent successfully' });
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Internal Server Error', error: err.message });
  }
};


export const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;
  try {
    const user = await UserModel.findOne({ email });
    if (!user) { return res.status(400).json({ message: "User not found" }); }
    if (user.otp !== otp) { return res.status(400).json({ message: "Invalid OTP" }); }
    if (user.otpExpiry < Date.now()) { return res.status(400).json({ message: "OTP expired" }); }

    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();
    res.status(200).json({ message: "OTP verified successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
