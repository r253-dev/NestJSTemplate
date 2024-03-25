import { Controller, UsePipes, HttpStatus, Get, Param, Post, Body } from '@nestjs/common';
import { ZodValidationPipe } from 'nestjs-zod';
import { ApiTags } from '@nestjs/swagger';

import { AdminManagePrefectureService } from './admin-manage-prefecture.service';

import { Swagger } from 'share/decorators/swagger';
import { AdminManagePrefectureResponseDto } from './dto/admin-manage-prefecture-response.dto';
import { AdminManagePrefectureCreationDto } from './dto/admin-manage-prefecture-create-dto';
import { PrefectureEntity } from './entities/prefecture.entity';

@Controller('admin/~/prefectures')
@ApiTags('prefecture', '管理者の都道府県管理モジュール')
@UsePipes(ZodValidationPipe)
export class AdminManagePrefectureController {
  constructor(private readonly service: AdminManagePrefectureService) {}

  @Post()
  @Swagger({
    operationId: 'createPrefecture',
    summary: '都道府県を登録する',
    description: '都道府県を登録する',
    body: { type: AdminManagePrefectureCreationDto },
    responses: [
      {
        status: HttpStatus.CREATED,
        type: AdminManagePrefectureResponseDto,
      },
      { status: HttpStatus.CONFLICT, description: '既に都道府県コードが登録されている' },
    ],
  })
  async create(
    @Body() creationDto: AdminManagePrefectureCreationDto,
  ): Promise<AdminManagePrefectureResponseDto> {
    const prefecture = await this.service.create(
      creationDto.code,
      creationDto.name,
      creationDto.nameKana,
    );
    return this.toResponse(prefecture);
  }

  @Get()
  @Swagger({
    operationId: 'getPrefectures',
    summary: '都道府県の一覧を取得する',
    description: '都道府県の一覧を取得する',
    responses: [
      {
        status: HttpStatus.OK,
        type: AdminManagePrefectureResponseDto,
        isArray: true,
      },
    ],
  })
  async findAll(): Promise<AdminManagePrefectureResponseDto[]> {
    const prefectures = await this.service.findAll();
    return prefectures.map((prefecture) => this.toResponse(prefecture));
  }

  @Get('count')
  @Swagger({
    operationId: 'countPrefecture',
    summary: '都道府県数を取得する',
    description: '都道府県数を取得する',
    responses: [
      {
        status: HttpStatus.OK,
        type: Number,
      },
    ],
  })
  async count(): Promise<number> {
    return await this.service.count();
  }

  @Get(':uuid')
  @Swagger({
    operationId: 'getPrefecture',
    summary: '都道府県を取得する',
    description: '都道府県を取得する',
    responses: [
      {
        status: HttpStatus.OK,
        type: AdminManagePrefectureResponseDto,
      },
    ],
  })
  async findByUuid(@Param('uuid') uuid: string): Promise<AdminManagePrefectureResponseDto> {
    const prefecture = await this.service.findByUuid(uuid);
    return this.toResponse(prefecture);
  }

  private toResponse(prefecture: PrefectureEntity): AdminManagePrefectureResponseDto {
    return {
      uuid: prefecture.uuid,
      code: prefecture.code,
      name: prefecture.name,
      nameKana: prefecture.nameKana,
    };
  }
}
