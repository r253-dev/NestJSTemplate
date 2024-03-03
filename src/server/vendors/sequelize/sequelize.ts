import { Sequelize } from 'sequelize';

const host = process.env.DB_HOST!;
const user = process.env.DB_USER!;
const database = process.env.DATABASE!;
const pass = process.env.DB_PASS;

export const sequelize = new Sequelize(database, user, pass, {
  dialect: 'mysql',
  host: host,
});
