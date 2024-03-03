import { Sequelize } from 'sequelize';

const socketPath = process.env.INSTANCE_CONNECTION_NAME;
const URI = `mysql://${process.env.DB_USER}:${process.env.DB_PASS}@${socketPath ? `/cloudsql/${socketPath}` : process.env.DB_HOST}/${process.env.DATABASE}`;
console.log(URI);
export const sequelize = new Sequelize(URI, { logging: false });
