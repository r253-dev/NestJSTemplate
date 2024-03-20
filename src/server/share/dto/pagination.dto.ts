import { createZodDto } from 'nestjs-zod';
import z from 'zod';

const paginationSchema = z.object({
  page: z.preprocess(
    (value) => parseInt(z.string().default('1').parse(value), 10),
    z.number().min(1),
  ),
  perPage: z.preprocess(
    (value) => parseInt(z.string().default('25').parse(value), 10),
    z.number().min(1).max(100),
  ),
});
export class PaginationDto extends createZodDto(paginationSchema) {}
