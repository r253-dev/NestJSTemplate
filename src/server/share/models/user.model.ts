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

const TABLE_NAME = 'users';

export const enum State {
  INACTIVE = 0,
  ACTIVE = 1,
  DISABLED = 2,
  REMOVED = 3,
}

export class UserModel extends Model<
  InferAttributes<UserModel>,
  InferCreationAttributes<UserModel>
> {
  static tableName = TABLE_NAME;

  declare id: CreationOptional<bigint>;
  declare tenantId: ForeignKey<TenantModel['id']>;
  declare uuid: string;
  declare code: string;
  declare passwordHash: string | null;
  declare state: number;
  declare name: string;
  declare displayName: string;
  declare email: string | null;
  declare createdAt: Date;

  declare tenant?: NonAttribute<TenantModel>;
}

UserModel.init(
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
      type: DataTypes.STRING(30),
      allowNull: false,
    },
    passwordHash: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    state: {
      type: DataTypes.TINYINT,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    displayName: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(512),
      allowNull: true,
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
    indexes: [
      {
        unique: true,
        name: 'uniqueUuid',
        fields: ['uuid'],
      },
      {
        unique: true,
        name: 'uniqueCode',
        fields: ['tenant_id', 'code'],
      },
      {
        unique: true,
        name: 'uniqueEmail',
        fields: ['tenant_id', 'email'],
      },
      {
        name: 'IDX:users:state',
        fields: ['state'],
      },
    ],
    defaultScope: {
      attributes: {
        exclude: ['passwordHash'],
      },
      where: {
        state: {
          [Op.ne]: State.REMOVED,
        },
      },
    },
  },
);

UserModel.belongsTo(TenantModel, {
  foreignKey: 'tenantId',
  targetKey: 'id',
});
