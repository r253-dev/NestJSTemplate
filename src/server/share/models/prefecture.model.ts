import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from 'sequelize';
import { sequelize } from '../../vendors/sequelize/sequelize';

export class PrefectureModel extends Model<
  InferAttributes<PrefectureModel>,
  InferCreationAttributes<PrefectureModel>
> {
  static tableName = 'prefectures';

  declare id: CreationOptional<bigint>;
  declare uuid: string;
  declare code: string;
  declare name: string;
  declare nameKana: string;
  declare createdAt: Date;
}

PrefectureModel.init(
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    uuid: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    code: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    nameKana: {
      type: DataTypes.STRING,
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
    modelName: 'prefectures',
    timestamps: false,
    indexes: [
      {
        unique: true,
        name: 'UNQ:prefectures:uniqueUuid',
        fields: ['uuid'],
      },
      {
        unique: true,
        name: 'UNQ:prefectures:uniqueCode',
        fields: ['code'],
      },
    ],
  },
);
