import { Sequelize } from 'sequelize';

const connectionName = process.env.INSTANCE_CONNECTION_NAME;
const host = connectionName ? `${connectionName}` : process.env.DB_HOST!;
const user = process.env.DB_USER!;
const database = process.env.DATABASE!;
const pass = process.env.DB_PASS;
// const URI = `mysql://${user}:${pass}@${connectionName ? `/cloudsql/${connectionName}` : host}/${database}`;
// console.log(URI);
// export const sequelize = new Sequelize(URI, { logging: false });
console.log({
  connectionName,
  host,
  user,
  database,
  pass,
});
export const sequelize = new Sequelize(database, user, pass, {
  dialect: 'mysql',
  host: host,
});
