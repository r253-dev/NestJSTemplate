import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Op,
} from 'sequelize';
import { sequelize } from '../../vendors/sequelize/sequelize';

export const enum State {
  INACTIVE = 0,
  ACTIVE = 1,
  DISABLED = 2,
  REMOVED = 3,
}

export class TenantModel extends Model<
  InferAttributes<TenantModel>,
  InferCreationAttributes<TenantModel>
> {
  static tableName = 'tenants';

  declare id: CreationOptional<bigint>;
  declare uuid: string;
  declare code: string;
  declare state: number;
  declare createdAt: Date;
}

TenantModel.init(
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    uuid: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: 'uniqueUuid',
    },
    code: {
      type: DataTypes.STRING(32),
      allowNull: false,
      unique: 'uniqueCode',
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
    modelName: 'tenants',
    timestamps: false,
    defaultScope: {
      where: {
        state: {
          [Op.ne]: State.REMOVED,
        },
      },
    },
  },
);
