import { InternalServerErrorException } from '@nestjs/common';
import { CreationOptional, InferAttributes, InferCreationAttributes, Model } from 'sequelize';

class ModelCore extends Model<InferAttributes<ModelCore>, InferCreationAttributes<ModelCore>> {
  declare id: CreationOptional<bigint>;
}

export interface PropertiesCore {
  id?: bigint;
}

export abstract class Entity<T extends PropertiesCore> {
  properties: T;
  protected constructor(properties: T) {
    this.properties = properties;
  }

  abstract toModel(): ModelCore;

  isPersisted(): boolean {
    return this.properties.id !== undefined;
  }

  protected getOptionalProperty<T>(property: T | undefined): T {
    if (property === undefined) {
      throw new InternalServerErrorException('property is undefined');
    }
    return property;
  }

  set _id(id: bigint | undefined) {
    if (id === undefined) {
      // 本来は引数で受け取らないよう制御すべきだが、実装簡略化のためこちら側でエラーを投げる
      throw new Error('id is undefined');
    }
    if (this.properties.id !== undefined) {
      throw new Error('id is already set');
    }
    this.properties.id = id;
  }

  get id(): bigint {
    if (this.properties.id === undefined) {
      throw new Error('id is undefined');
    }
    return this.properties.id;
  }
}
