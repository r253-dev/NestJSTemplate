import { DataTypes, QueryInterface, Sequelize } from 'sequelize';

export async function up(queryInterface: QueryInterface, _s: Sequelize) {
  await queryInterface.createTable(
    'administrators',
    {
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
      email: {
        allowNull: false,
        type: DataTypes.STRING(512),
      },
      password_hash: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      created_at: {
        allowNull: false,
        type: DataTypes.DATE,
      },
    },
    {
      uniqueKeys: {
        uniqueUuid: {
          fields: ['uuid'],
        },
        uniqueEmail: {
          fields: ['email'],
        },
      },
    },
  );
}

export async function down(queryInterface: QueryInterface, _s: Sequelize) {
  await queryInterface.dropTable('administrators');
}
