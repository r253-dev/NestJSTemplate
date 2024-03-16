import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from 'sequelize';
import { sequelize } from 'vendors/sequelize/sequelize';

export class AdministratorModel extends Model<
  InferAttributes<AdministratorModel>,
  InferCreationAttributes<AdministratorModel>
> {
  static tableName = 'administrators';

  declare id: CreationOptional<bigint>;
  declare uuid: string;
  declare email: string;
  declare passwordHash: string | null;
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
      type: DataTypes.STRING,
      allowNull: false,
      unique: 'uniqueEmail',
    },
    passwordHash: {
      type: DataTypes.STRING,
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
    modelName: 'administrators',
    timestamps: false,
  },
);
