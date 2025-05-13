import express from 'express';
import { login, logout, signup, updateProfile } from '../controllers/auth.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post("/login", login);
router.post("/logout", logout);
router.post("/signup", signup);

//protectRoute checks if the user has been authenticated.
router.put("/update-profile", protectRoute, updateProfile);

export default router;