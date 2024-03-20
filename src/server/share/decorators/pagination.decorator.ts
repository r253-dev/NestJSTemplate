import { ExecutionContext, applyDecorators, createParamDecorator } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';
import { PaginationDto } from 'share/dto/pagination.dto';

export function ApiPagination() {
  return applyDecorators(
    ApiQuery({
      name: 'page',
      required: false,
      description: 'ページ番号',
      schema: { default: 1, minimum: 1, type: 'number' },
    }),
    ApiQuery({
      name: 'perPage',
      required: false,
      description: '1ページあたりの件数',
      schema: { default: 20, minimum: 1, maximum: 100, type: 'number' },
    }),
  );
}

export const Pagination = createParamDecorator(
  (data: unknown, context: ExecutionContext): PaginationDto => {
    const req = context.switchToHttp().getRequest();
    return {
      perPage: req.query.perPage,
      page: req.query.page,
    };
  },
);
