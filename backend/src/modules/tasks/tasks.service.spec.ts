import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { TASK_REPOSITORY } from './repositories/task-token';
import { NotFoundException } from '@nestjs/common';
import { CATEGORY_REPOSITORY } from '../categories/repositories/category-token';

describe('TasksService', () => {
  let service: TasksService;

  const mockTaskRepository = {
    findByIdAndUserId: jest.fn(),
  };

  const mockCategoryRepository = {
    findByIdAndUserId: jest.fn(),
  };

  beforeEach(async () => {

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: TASK_REPOSITORY,
          useValue: mockTaskRepository,
        },
        {
          provide: CATEGORY_REPOSITORY,
          useValue: mockCategoryRepository,
        }
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
  });

  describe('findOne', () => {
    it('should return task when task exists', async () => {
      const mockTask = {
        id: 'task-1',
        title: 'Test task',
        description: 'Demo',
        status: 'NOT_STARTED',
        priority: 'LOW',
        categoryId: null,
        expiredAt: null,
      };

      mockTaskRepository.findByIdAndUserId.mockResolvedValue(mockTask);

      const result = await service.findOne('task-1', 'user-1');

      expect(mockTaskRepository.findByIdAndUserId).toHaveBeenCalledWith(
        'task-1',
        'user-1',
      );
      expect(result).toEqual(mockTask);
    });

    it('should throw NotFoundException when task does not exist', async () => {
      mockTaskRepository.findByIdAndUserId.mockResolvedValue(null);

      await expect(service.findOne('task-1', 'user-1')).rejects.toThrow(
        NotFoundException,
      );

      expect(mockTaskRepository.findByIdAndUserId).toHaveBeenCalledWith(
        'task-1',
        'user-1',
      );
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
