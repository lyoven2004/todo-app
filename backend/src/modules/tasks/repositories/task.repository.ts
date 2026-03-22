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
  status?: TaskStatus;
  priority?: TaskPriority;
  categoryId?: string;

  sortBy?: 'createdAt' | 'expiredAt';
  sortOrder?: 'asc' | 'desc';

  page?: number;
  limit?: number;
};

export type TPaginationTaskResult<T> = {
  page: number;
  totalPage: number;
  data: T[];
};

export interface ITaskRepository {
  create(userId: string, data: TCreateTaskInput): Promise<TTask>;
  findById(id: string): Promise<TTask | null>;
  findByUserId(userId: string): Promise<TTask[]>;
  findByIdAndUserId(id: string, userId: string): Promise<TTask | null>;
  findAllByUserId(userId: string, query: TQueryTask): Promise<TPaginationTaskResult<TTask>>;
  delete(id: string): Promise<void>;
}