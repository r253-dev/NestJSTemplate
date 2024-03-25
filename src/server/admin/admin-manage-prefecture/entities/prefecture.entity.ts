import { v4 } from 'uuid';
import { PrefectureModel } from 'share/models/prefecture.model';
import { PrefectureEntityCore } from 'share/entities/prefecture.core.entity';

export class PrefectureEntity extends PrefectureEntityCore {
  static factory(code: string, name: string, nameKana: string): PrefectureEntity {
    const uuid = v4();
    return new PrefectureEntity({
      uuid,
      code,
      name,
      nameKana,
      createdAt: new Date(),
    });
  }

  static fromModel(model: PrefectureModel): PrefectureEntity {
    const base = PrefectureEntityCore.fromModel(model);
    return new PrefectureEntity(base.properties);
  }
}
