import { TaskPriority, TaskStatus, TTask } from "../entities/task.entity";

export type TCreateTaskInput = {
  title: string;
  description?: string | null;
  priority?: TaskPriority;
  status?: TaskStatus;
  userId: string;
  categoryId?: string | null;
  expiredAt?: Date | null;
};

export interface ITaskRepository {
  create(data: TCreateTaskInput): Promise<TTask>;
  findById(id: string): Promise<TTask | null>;
  findByUserId(userId: string): Promise<TTask[]>;
}