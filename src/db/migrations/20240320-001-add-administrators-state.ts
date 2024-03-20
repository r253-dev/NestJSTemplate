import { DataTypes, QueryInterface, Sequelize } from 'sequelize';

export async function up(queryInterface: QueryInterface, _s: Sequelize) {
  await queryInterface.addColumn('administrators', 'state', {
    type: DataTypes.TINYINT,
    allowNull: false,
    defaultValue: 0,
  });
}

export async function down(queryInterface: QueryInterface, _s: Sequelize) {
  await queryInterface.removeColumn('administrators', 'state');
}
