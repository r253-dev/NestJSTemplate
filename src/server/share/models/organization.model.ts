import {
  CreationOptional,
  DataTypes,
  ForeignKey,
  InferAttributes,
  InferCreationAttributes,
  Model,
  NonAttribute,
  Op,
} from 'sequelize';
import { sequelize } from '../../vendors/sequelize/sequelize';
import { TenantModel } from './tenant.model';

const TABLE_NAME = 'organizations';

export const enum State {
  ACTIVE = 1,
  DISABLED = 2,
  REMOVED = 3,
  ARCHIVED = 4,
}

export class OrganizationModel extends Model<
  InferAttributes<OrganizationModel>,
  InferCreationAttributes<OrganizationModel>
> {
  static tableName = TABLE_NAME;

  declare id: CreationOptional<bigint>;
  declare tenantId: ForeignKey<TenantModel['id']>;
  declare uuid: string;
  declare code: string | null;
  declare name: string;
  declare nameKana: string;
  declare state: number;
  declare createdAt: Date;

  declare tenant?: NonAttribute<TenantModel>;
}

OrganizationModel.init(
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    tenantId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: TenantModel,
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    uuid: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    code: {
      type: DataTypes.STRING(10),
      allowNull: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    nameKana: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    state: {
      type: DataTypes.TINYINT,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    sequelize,
    underscored: true,
    modelName: TABLE_NAME,
    timestamps: false,
    defaultScope: {
      where: {
        state: {
          [Op.ne]: State.REMOVED,
        },
      },
    },
    indexes: [
      {
        unique: false,
        name: `IDX:${TABLE_NAME}:state`,
        fields: ['state'],
      },
      {
        unique: true,
        name: `UNQ:${TABLE_NAME}:uuid`,
        fields: ['uuid'],
      },
      {
        unique: true,
        name: `UNQ:${TABLE_NAME}:code`,
        fields: ['code', 'tenant_id'],
      },
    ],
  },
);

OrganizationModel.belongsTo(TenantModel, {
  foreignKey: 'tenantId',
  targetKey: 'id',
});
