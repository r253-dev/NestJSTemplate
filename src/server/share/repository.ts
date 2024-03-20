import { Entity, PropertiesCore } from 'share/entity';

export async function save<T extends PropertiesCore>(entity: Entity<T>): Promise<void> {
  const model = entity.toModel();
  await model.save();
  if (!entity.isPersisted()) {
    entity._id = model.id;
  }
}

export function buildPaginationCondition(condition: { page: number; perPage: number }) {
  return {
    limit: condition.perPage,
    offset: (condition.page - 1) * condition.perPage,
  };
}
