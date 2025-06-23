import express from 'express';
import cookieParser from 'cookie-parser';
import path from 'path';
import dotenv from 'dotenv';
import router from './routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../public')));

app.use('/api', router);

// // SPA fallback
// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, '../public/index.html'));
// });

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
