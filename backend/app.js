const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const errorMiddleware = require('./middlewares/errorMiddleware');
const { success } = require('./utils/response');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  return success(res, { status: 'ok' }, 'API is healthy');
});

app.use('/api/auth', authRoutes);

app.use(errorMiddleware);

module.exports = app;
