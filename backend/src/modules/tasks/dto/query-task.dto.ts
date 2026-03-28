import {
  IsOptional,
  IsEnum,
  IsUUID,
  IsInt,
  Min,
  IsIn,
} from 'class-validator';
import { Type } from 'class-transformer';
import { TaskPriority, TaskStatus } from '../entities/task.entity';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';

export class QueryTasksDto extends PaginationQueryDto {
  @IsEnum(TaskStatus)
  @IsOptional()
  status?: TaskStatus;

  @IsEnum(TaskPriority)
  @IsOptional()
  priority?: TaskPriority;

  @IsUUID()
  @IsOptional()
  categoryId?: string;

  @IsIn(['createdAt', 'expiredAt'])
  @IsOptional()
  sortBy?: 'createdAt' | 'expiredAt';

  @IsIn(['asc', 'desc'])
  @IsOptional()
  sortOrder?: 'asc' | 'desc';
}