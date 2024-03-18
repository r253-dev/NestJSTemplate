import { Sequelize } from 'sequelize';

const uri = process.env.DB_URI;
const host = process.env.DB_HOST!;
const user = process.env.DB_USER!;
const database = process.env.DATABASE!;
const pass = process.env.DB_PASS;

export const sequelize = factory();

function factory() {
  if (uri) {
    return new Sequelize(uri, {
      logging: false,
    });
  }
  return new Sequelize(database, user, pass, {
    dialect: 'mysql',
    host,
    logging: false,
  });
}
