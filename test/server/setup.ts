import { readdirSync } from 'fs';
import { join } from 'path';
import { sequelize } from '../../src/server/vendors/sequelize/sequelize';

module.exports = async () => {
  readdirSync(join(__dirname, '../../src/server/share/models'))
    .filter((file: string) => {
      return file.indexOf('.') !== 0 && file.slice(-3) === '.ts';
    })
    .forEach((file: string) => {
      require(join(__dirname, '../../src/server/share/models', file));
    });

  await sequelize.sync({ force: true });

  await sequelize.query(
    'INSERT INTO administrators(uuid, email, password_hash, created_at) VALUES ("3b30345f-8890-4559-9af7-e243662296ca", "test@example.com", "$2b$10$gXma497mgORuUxk52mcIVusd7W2HCJK3RoMTnOam30m5.rXh4whbK", "2024-01-01T00:00:00.000+09:00")',
  );
};
