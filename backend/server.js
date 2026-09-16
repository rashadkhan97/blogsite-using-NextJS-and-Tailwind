require('dotenv').config();
const app = require('./app');
const sequelize = require('./config/db');
require('./models/User');
const logger = require('./utils/logger');

const PORT = process.env.PORT || 5000;

const start = async () => {
  try {
    await sequelize.authenticate();
    logger.info('Database connected');

    await sequelize.sync();
    logger.info('Models synced');

    app.listen(PORT, () => {
      logger.info(`Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    logger.error(`Failed to start server: ${err.message}`);
    process.exit(1);
  }
};

start();
