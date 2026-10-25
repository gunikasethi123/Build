import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import api from './routes/api.js';

const app = express();
const PORT = Number(process.env.PORT || 4000);

app.use(cors({ origin: ['http://localhost:5173', 'http://127.0.0.1:5173'] }));
app.use(express.json({ limit: '1mb' }));
app.use('/api', api);

app.use((err, _req, res, _next) => {
  console.error(err);
  if (err.code === 'ER_NO_SUCH_TABLE' || err.code === 'ECONNREFUSED' || err.code === 'ER_ACCESS_DENIED_ERROR' || err.code === 'ER_BAD_DB_ERROR') {
    return res.status(503).json({ error: 'Database is not ready. Check MySQL, .env, and run server/schema.sql.', details: err.message });
  }
  res.status(500).json({ error: err.message || 'Server error' });
});

app.listen(PORT, () => console.log(`BuildSphere API running at http://localhost:${PORT}/api/health`));
