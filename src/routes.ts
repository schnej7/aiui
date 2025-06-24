import { Router, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { User } from './db';
import { AIConfig } from './models/AI';
import { authenticateToken, AuthRequest } from './auth';

const JWT_SECRET = process.env.JWT_SECRET!;
const router = Router();

// Number of salt rounds for bcrypt
const SALT_ROUNDS = 10;

// Signup
router.post('/signup', async (req: Request, res: Response): Promise<void> => {
  const { username, password, name } = req.body;

  if (!username || !password || !name) {
    res.status(400).json({ error: 'Missing fields' });
    return;
  }

  // Check if username exists
  const existingUser = await User.findOne({ username }).exec();
  if (existingUser) {
    res.status(409).json({ error: 'Username already exists' });
    return;
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  // Create new user
  const newUser = new User({ username, password: hashedPassword, name });
  await newUser.save();

  res.status(201).json({ message: 'User created' });
});

// Login with bcrypt compare
router.post('/login', async (req: Request, res: Response): Promise<void> => {
  const { username, password } = req.body;

  const user = await User.findOne({ username }).exec();
  if (!user) {
    res.status(401).json({ error: 'Invalid credentials' });
    return;
  }

  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    res.status(401).json({ error: 'Invalid credentials' });
    return;
  }

  const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });
  res.cookie('token', token, { httpOnly: true });
  res.json({ message: 'Logged in' });
});



router.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logged out' });
});

router.get('/user', authenticateToken, async (req: AuthRequest, res): Promise<void> => {
  const user = await User.findById(req.userId).select('username name').exec();
  if (!user) {
    res.sendStatus(404);
    return;
  }

  const ais = await AIConfig.find({ userId: user._id }).exec();

  res.json({ user, ais });
});

export default router;
