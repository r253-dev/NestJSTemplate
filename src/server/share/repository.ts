import { Entity, PropertiesCore } from 'share/entity';

export async function save<T extends PropertiesCore>(entity: Entity<T>): Promise<void> {
  const model = entity.toModel();
  await model.save();
  if (!entity.isPersisted()) {
    entity._id = model.id;
  }
}
