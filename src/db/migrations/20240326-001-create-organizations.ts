import { DataTypes, QueryInterface, Sequelize } from 'sequelize';

const TABLE_NAME = 'organizations';

export async function up(queryInterface: QueryInterface, _s: Sequelize) {
  await queryInterface.createTable(TABLE_NAME, {
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
      allowNull: true,
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
    state: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 0,
    },
    created_at: {
      allowNull: false,
      type: DataTypes.DATE,
    },
  });

  await queryInterface.addIndex(TABLE_NAME, ['state'], { name: `IDX:${TABLE_NAME}:state` });
  await queryInterface.addIndex(TABLE_NAME, ['uuid'], {
    name: `UNQ:${TABLE_NAME}:uuid`,
    unique: true,
  });
  await queryInterface.addIndex(TABLE_NAME, ['code', 'tenant_id'], {
    name: `UNQ:${TABLE_NAME}:code`,
    unique: true,
  });
}

export async function down(queryInterface: QueryInterface, _s: Sequelize) {
  await queryInterface.removeIndex(TABLE_NAME, `IDX:${TABLE_NAME}:state`);
  await queryInterface.removeIndex(TABLE_NAME, `UNQ:${TABLE_NAME}:uuid`);
  await queryInterface.removeIndex(TABLE_NAME, `UNQ:${TABLE_NAME}:code`);
  await queryInterface.dropTable(TABLE_NAME);
}
