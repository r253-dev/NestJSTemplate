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

export class AdministratorModel extends Model<
  InferAttributes<AdministratorModel>,
  InferCreationAttributes<AdministratorModel>
> {
  static tableName = 'administrators';

  declare id: CreationOptional<bigint>;
  declare uuid: string;
  declare email: string;
  declare passwordHash: string | null;
  declare state: number;
  declare createdAt: Date;
}

AdministratorModel.init(
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
    email: {
      type: DataTypes.STRING(512),
      allowNull: false,
      unique: 'uniqueEmail',
    },
    passwordHash: {
      type: DataTypes.STRING,
      allowNull: true,
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
    modelName: 'administrators',
    timestamps: false,
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
