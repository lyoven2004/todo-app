export type TTask = {
  id: string;
  title: string;
  description: string | null;

  status: TaskStatus;
  priority: TaskPriority;

  userId: string;

  categoryId: string | null;

  expiredAt: Date | null;

  createdAt: Date;
  updatedAt: Date;
};

export enum TaskStatus {
  NOT_STARTED = 'NOT_STARTED',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE',
  FAILED = 'FAILED',
}

export enum TaskPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
}