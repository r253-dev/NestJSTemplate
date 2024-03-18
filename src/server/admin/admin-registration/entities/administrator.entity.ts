import { v4 } from 'uuid';
import { AdministratorModel } from 'share/models/administrator.model';
import { Entity, PropertiesCore } from 'share/entity';

interface PropertiesEssential {
  email: string;
}

interface Properties extends PropertiesCore, PropertiesEssential {
  uuid: string;
  passwordHash: string | null;
  createdAt: Date;
}

export class AdministratorEntity extends Entity<Properties> {
  static factory(email: string): AdministratorEntity {
    const uuid = v4();
    return new AdministratorEntity({
      email,
      uuid,
      passwordHash: null,
      createdAt: new Date(),
    });
  }

  static fromModel(model: AdministratorModel): AdministratorEntity {
    return new AdministratorEntity({
      id: model.id,
      uuid: model.uuid,
      email: model.email,
      passwordHash: model.passwordHash,
      createdAt: model.createdAt,
    });
  }

  toModel(): AdministratorModel {
    const model = new AdministratorModel({
      id: this.properties.id,
      uuid: this.properties.uuid,
      email: this.properties.email,
      passwordHash: this.properties.passwordHash,
      createdAt: this.properties.createdAt,
    });
    model.isNewRecord = this.properties.id === undefined;
    return model;
  }
}
