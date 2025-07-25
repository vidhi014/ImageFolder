// api.js
import axios from 'axios';

const API_BASE_URL = "http://localhost:4000/api";

export const signIn = async (credentials) => {
  return await axios.post(`${API_BASE_URL}/auth/signin`, credentials);
};

export const signUp = async (userData) => {
  return await axios.post(`${API_BASE_URL}/auth/signup`, userData);
};

export const sendOtp = async (email, reason) => {
  return await axios.post(`${API_BASE_URL}/auth/send-otp`, { email, reason });
};

export const verifyOtp = async (email, otp) => {
  return await axios.post(`${API_BASE_URL}/verify-otp`, { email, otp });
};

export const resetPassword = async (email, newPassword) => {
  return await axios.post(`${API_BASE_URL}/reset-password`, { email, newPassword });
};

export const googleSignIn = async (userData) => {
  return await axios.post(`${API_BASE_URL}/google-auth`, userData);
};

export const findUserByEmail = async (email) => {
  return await axios.get(`${API_BASE_URL}/user/email/${email}`);
};