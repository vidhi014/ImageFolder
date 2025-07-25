// middleware/checkBlacklist.js
import { TokenBlacklist } from '../model/tokenBlacklist.js';

export const checkBlacklist = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const blacklistedToken = await TokenBlacklist.findOne({ token });

    if (blacklistedToken) {
      return res.status(401).json({ message: 'Token is blacklisted', success: false });
    }

    next();
  } catch (err) {
    res.status(500).json({ message: "Internal server error", success: false });
  }
};
