import { DataTypes, QueryInterface, Sequelize } from 'sequelize';

const TABLE_NAME = 'users';

export async function up(queryInterface: QueryInterface, _s: Sequelize) {
  await queryInterface.addColumn(TABLE_NAME, 'name', {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: '',
  });
  await queryInterface.addColumn(TABLE_NAME, 'display_name', {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: '',
  });
}

export async function down(queryInterface: QueryInterface, _s: Sequelize) {
  await queryInterface.removeColumn(TABLE_NAME, 'display_name');
  await queryInterface.removeColumn(TABLE_NAME, 'name');
}
