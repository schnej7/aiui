import { Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { User } from './db';
import { authenticateToken, AuthRequest } from './auth';

const JWT_SECRET = process.env.JWT_SECRET!;
const router = Router();

// Number of salt rounds for bcrypt
const SALT_ROUNDS = 10;

// Signup
router.post('/api/signup', async (req, res) => {
  const { username, password, name } = req.body;

  if (!username || !password || !name) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  // Check if username exists
  const existingUser = await User.findOne({ username }).exec();
  if (existingUser) {
    return res.status(409).json({ error: 'Username already exists' });
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  // Create new user
  const newUser = new User({ username, password: hashedPassword, name });
  await newUser.save();

  res.status(201).json({ message: 'User created' });
});

// Login with bcrypt compare
router.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username }).exec();
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });

  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) return res.status(401).json({ error: 'Invalid credentials' });

  const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });
  res.cookie('token', token, { httpOnly: true });
  res.json({ message: 'Logged in' });
});



router.post('/api/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logged out' });
});

router.get('/api/user', authenticateToken, async (req: AuthRequest, res) => {
  const user = await User.findById(req.userId).select('username name').exec();
  if (!user) return res.sendStatus(404);
  res.json(user);
});

export default router;
