import { Type, applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

export function Swagger(swagger: {
  operationId: string;
  summary: string;
  description: string;
  responses: (
    | { status: 204 | 400 | 401 }
    | {
        status: 200 | 201;
        type?: Type<unknown>;
      }
    | {
        status: 403 | 409;
        description?: string;
      }
  )[];
}) {
  const decorators = [
    ApiOperation({
      operationId: swagger.operationId,
      summary: swagger.summary,
      description: swagger.description,
    }),
  ];

  swagger.responses.forEach((response) => {
    switch (response.status) {
      case 200:
        decorators.push(ApiOkResponse({ type: response.type }));
        break;

      case 201:
        decorators.push(ApiCreatedResponse({ type: response.type }));
        break;

      case 204:
        decorators.push(ApiNoContentResponse());
        break;

      case 400:
        decorators.push(
          ApiBadRequestResponse({
            description: 'リクエストの形式が正しくない',
          }),
        );
        break;

      case 401:
        decorators.push(
          ApiUnauthorizedResponse({
            description: 'リクエストが認証されていない',
          }),
        );
        break;

      case 403:
        decorators.push(
          ApiForbiddenResponse({
            description: response.description && 'リクエストが許可されていない',
          }),
        );
        break;

      case 409:
        decorators.push(
          ApiConflictResponse({
            description: response.description && 'リクエストが競合している',
          }),
        );
        break;
    }
  });

  return applyDecorators(...decorators);
}
