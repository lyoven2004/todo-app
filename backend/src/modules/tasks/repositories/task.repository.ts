import { TPaginationResult } from "src/common/types/pagination.type";
import { TaskPriority, TaskStatus, TTask } from "../entities/task.entity";

export type TCreateTaskInput = {
  title: string;
  description?: string | null;
  priority?: TaskPriority;
  status?: TaskStatus;
  categoryId?: string | null;
  expiredAt?: Date | null;
};

export type TQueryTask = {
  search?: string
  status?: TaskStatus;
  priority?: TaskPriority;
  categoryId?: string;
  sortBy?: 'createdAt' | 'expiredAt';
  sortOrder?: 'asc' | 'desc';

  page?: number;
  limit?: number;
};

export type TUpdateTaskInput = {
  title?: string;
  description?: string | null;
  status?: TaskStatus;
  priority?: TaskPriority;
  categoryId?: string | null;
  expiredAt?: Date | null;
};

export interface ITaskRepository {
  create(userId: string, data: TCreateTaskInput): Promise<TTask>;
  findById(id: string): Promise<TTask | null>;
  findByUserId(userId: string): Promise<TTask[]>;
  findByIdAndUserId(id: string, userId: string): Promise<TTask | null>;
  findAllByUserId(userId: string, query: TQueryTask): Promise<TPaginationResult<TTask>>;
  delete(id: string): Promise<void>;
  update(id: string, userId: string, data: TUpdateTaskInput): Promise<TTask>;
}