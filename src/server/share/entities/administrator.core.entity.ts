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

export class AdministratorEntityCore extends Entity<Properties> {
  static factory(email: string): AdministratorEntityCore {
    const uuid = v4();
    return new AdministratorEntityCore({
      email,
      uuid,
      passwordHash: null,
      createdAt: new Date(),
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

  get uuid(): string {
    return this.properties.uuid;
  }

  get email(): string {
    return this.properties.email;
  }

  get createdAt(): Date {
    return this.properties.createdAt;
  }
}
