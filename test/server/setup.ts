import { readdirSync } from 'fs';
import { join } from 'path';
import { sequelize } from '../../src/server/vendors/sequelize/sequelize';
import { State as AdministratorState } from 'share/models/administrator.model';

module.exports = async () => {
  readdirSync(join(__dirname, '../../src/server/share/models'))
    .filter((file: string) => {
      return file.indexOf('.') !== 0 && file.slice(-3) === '.ts';
    })
    .forEach((file: string) => {
      require(join(__dirname, '../../src/server/share/models', file));
    });

  await sequelize.sync({ force: true });
  await initializeAdministrator();
};

async function initializeAdministrator() {
  await sequelize.query(
    `INSERT INTO administrators(uuid, email, password_hash, state, created_at) VALUES
       ("3b30345f-8890-4559-9af7-e243662296ca", "test@example.com", "$2b$10$gXma497mgORuUxk52mcIVusd7W2HCJK3RoMTnOam30m5.rXh4whbK", ${AdministratorState.ACTIVE}, "2024-01-01T00:00:00.000+09:00")
       ,("41cd278a-b643-4896-bf18-10e0f33b768c", "removed@example.com", "$2b$10$gXma497mgORuUxk52mcIVusd7W2HCJK3RoMTnOam30m5.rXh4whbK", ${AdministratorState.REMOVED}, "2024-01-01T00:00:00.000+09:00")
       ,("2f18aeba-eb6f-4f84-91e3-7e72930ac8d7", "inactive@example.com", "$2b$10$gXma497mgORuUxk52mcIVusd7W2HCJK3RoMTnOam30m5.rXh4whbK", ${AdministratorState.INACTIVE}, "2024-01-01T00:00:00.000+09:00")
       ,("f4d587ec-7975-4d07-bc93-3f20c22c4d3c", "disabled@example.com", "$2b$10$gXma497mgORuUxk52mcIVusd7W2HCJK3RoMTnOam30m5.rXh4whbK", ${AdministratorState.DISABLED}, "2024-01-01T00:00:00.000+09:00")
    `,
  );
}
