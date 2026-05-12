import express from 'express';
import cors from 'cors';
import healthRouter from './routes/health.js';
import zonesRouter from './routes/zones.js';
import subAreasRouter from './routes/subAreas.js';
import exercisesRouter from './routes/exercises.js';

const PORT = Number(process.env.PORT ?? 3001);
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN ?? 'http://localhost:5173';

const app = express();

app.use(cors({ origin: CLIENT_ORIGIN }));
app.use(express.json());

app.use('/api/health', healthRouter);
app.use('/api/zones', zonesRouter);
app.use('/api/sub-areas', subAreasRouter);
app.use('/api/exercises', exercisesRouter);

app.use((_req, res) => {
  res.status(404).json({ error: 'Not found' });
});

app.listen(PORT, () => {
  console.log(`[server] listening on http://localhost:${PORT}`);
});
