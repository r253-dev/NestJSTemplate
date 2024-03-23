import { DataTypes, QueryInterface, Sequelize } from 'sequelize';

export async function up(queryInterface: QueryInterface, _s: Sequelize) {
  await queryInterface.createTable(
    'users',
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.BIGINT,
      },
      tenant_id: {
        allowNull: false,
        type: DataTypes.BIGINT,
        references: {
          model: 'tenants',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      uuid: {
        allowNull: false,
        type: DataTypes.UUID,
      },
      code: {
        allowNull: false,
        type: DataTypes.STRING(30),
      },
      password_hash: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      state: {
        type: DataTypes.TINYINT,
        allowNull: false,
        defaultValue: 0,
      },
      email: {
        allowNull: false,
        type: DataTypes.STRING(512),
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
          fields: ['tenant_id', 'code'],
        },
        uniqueEmail: {
          fields: ['tenant_id', 'email'],
        },
      },
    },
  );

  await queryInterface.addIndex('users', ['state'], { name: 'IDX:users:state' });
}

export async function down(queryInterface: QueryInterface, _s: Sequelize) {
  await queryInterface.removeIndex('users', 'IDX:users:state');
  await queryInterface.dropTable('users');
}
