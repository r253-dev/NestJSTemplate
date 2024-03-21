import { DataTypes, QueryInterface, Sequelize } from 'sequelize';

export async function up(queryInterface: QueryInterface, _s: Sequelize) {
  await queryInterface.createTable(
    'tenants',
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
      code: {
        allowNull: false,
        type: DataTypes.STRING(32),
      },
      state: {
        type: DataTypes.TINYINT,
        allowNull: false,
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
        uniqueCode: {
          fields: ['code'],
        },
      },
    },
  );

  await queryInterface.addIndex('tenants', ['state'], { name: 'IDX:tenants_state' });
}

export async function down(queryInterface: QueryInterface, _s: Sequelize) {
  await queryInterface.removeIndex('tenants', 'IDX:tenants_state');
  await queryInterface.dropTable('tenants');
}
