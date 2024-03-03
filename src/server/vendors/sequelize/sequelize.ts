import { Sequelize } from 'sequelize';

const socketPath = process.env.INSTANCE_CONNECTION_NAME;
export const sequelize = new Sequelize(
  `mysql://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}/${process.env.DATABASE}${socketPath ? `?socketPath=${socketPath}` : ''}`,
  {
    logging: false,
  },
);
