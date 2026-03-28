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
import { QueryDto } from 'src/common/dto/query.dto';

export class QueryTasksDto extends QueryDto{
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