import { DataTypes, QueryInterface, Sequelize } from 'sequelize';

export async function up(queryInterface: QueryInterface, _s: Sequelize) {
  await queryInterface.createTable('prefectures', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.BIGINT,
    },
    uuid: {
      allowNull: false,
      type: DataTypes.UUID,
    },
    code: {
      allowNull: false,
      type: DataTypes.STRING(10),
    },
    name: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    name_kana: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    created_at: {
      allowNull: false,
      type: DataTypes.DATE,
    },
  });
  await queryInterface.addIndex('prefectures', ['uuid'], { name: 'UNQ:prefectures:uuid' });
  await queryInterface.addIndex('prefectures', ['code'], { name: 'UNQ:prefectures:code' });
}

export async function down(queryInterface: QueryInterface, _s: Sequelize) {
  await queryInterface.removeIndex('prefectures', 'UNQ:prefectures:uuid');
  await queryInterface.removeIndex('prefectures', 'UNQ:prefectures:code');
  await queryInterface.dropTable('prefectures');
}
