import { TaskPriority, TaskStatus, TTask } from "../entities/task.entity";

export type TCreateTaskInput = {
  title: string;
  description?: string | null;
  priority?: TaskPriority;
  status?: TaskStatus;
  categoryId?: string | null;
  expiredAt?: Date | null;
};

export interface ITaskRepository {
  create(userId: string, data: TCreateTaskInput): Promise<TTask>;
  findById(id: string): Promise<TTask | null>;
  findByUserId(userId: string): Promise<TTask[]>;
  findByIdAndUserId(id: string, userId: string): Promise<TTask | null>;
  delete(id: string): Promise<void>;
}