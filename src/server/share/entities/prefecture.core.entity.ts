import { Entity, PropertiesCore } from 'share/entity';
import { PrefectureModel } from 'share/models/prefecture.model';

interface PropertiesEssential {
  code: string;
  name: string;
  nameKana: string;
}

interface Properties extends PropertiesCore, PropertiesEssential {
  uuid: string;
  createdAt: Date;
}

export class PrefectureEntityCore extends Entity<Properties> {
  toModel(): PrefectureModel {
    const model = new PrefectureModel({
      id: this.properties.id,
      uuid: this.properties.uuid,
      code: this.properties.code,
      name: this.properties.name,
      nameKana: this.properties.nameKana,
      createdAt: this.properties.createdAt,
    });
    model.isNewRecord = this.properties.id === undefined;
    return model;
  }

  static fromModel(model: PrefectureModel): PrefectureEntityCore {
    return new PrefectureEntityCore({
      id: model.id,
      uuid: model.uuid,
      code: model.code,
      name: model.name,
      nameKana: model.nameKana,
      createdAt: model.createdAt,
    });
  }

  get uuid(): string {
    return this.properties.uuid;
  }

  get code(): string {
    return this.properties.code;
  }

  get name(): string {
    return this.properties.name;
  }

  get nameKana(): string {
    return this.properties.nameKana;
  }

  get createdAt(): Date {
    return this.properties.createdAt;
  }
}
