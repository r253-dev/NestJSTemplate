import { Sequelize } from 'sequelize';

export const sequelize = new Sequelize(
  process.env.DATABASE!,
  process.env.DB_USER!,
  process.env.DB_PASS!,
  {
    host: process.env.INSTANCE_CONNECTION_NAME!,
    dialect: 'mysql',
    logging: false,
  },
);
