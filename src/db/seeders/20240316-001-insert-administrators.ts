import { QueryInterface, Sequelize } from 'sequelize';

export async function up(queryInterface: QueryInterface, _s: Sequelize) {
  await queryInterface.sequelize.query(
    `INSERT INTO administrators(uuid, email, password_hash, created_at) VALUES
    ("90f515af-4aa4-4937-9c67-3dd83d011170", "admin@example.com", "$2b$10$gXma497mgORuUxk52mcIVusd7W2HCJK3RoMTnOam30m5.rXh4whbK", "2024-01-01T00:00:00.000+09:00");`,
  );
}

export async function down(queryInterface: QueryInterface, _s: Sequelize) {
  await queryInterface.sequelize.query(
    `DELETE FROM administrators WHERE uuid = "90f515af-4aa4-4937-9c67-3dd83d011170";`,
  );
}
