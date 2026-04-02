import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { TASK_REPOSITORY } from './repositories/task-token';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CATEGORY_REPOSITORY } from '../categories/repositories/category-token';

describe('TasksService', () => {
  let service: TasksService;

  const mockTaskRepository = {
    findByIdAndUserId: jest.fn(),
    delete: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
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

  describe('delete', () => {
    it('should delete task successfully', async () => {
      mockTaskRepository.findByIdAndUserId.mockResolvedValue({
        id: 'task-1',
        title: 'Test task',
        userId: 'user-1',
      });

      mockTaskRepository.delete.mockResolvedValue(undefined);

      const result = await service.delete('task-1', 'user-1');

      expect(mockTaskRepository.findByIdAndUserId).toHaveBeenCalledWith(
        'task-1',
        'user-1',
      );
      expect(mockTaskRepository.delete).toHaveBeenCalledWith('task-1');
      expect(result).toEqual({
        message: 'Task deleted successfully',
      });
    });

    it('should throw NotFoundException when task does not exist', async () => {
      mockTaskRepository.findByIdAndUserId.mockResolvedValue(null);

      await expect(service.delete('task-1', 'user-1')).rejects.toThrow(
        NotFoundException,
      );

      expect(mockTaskRepository.findByIdAndUserId).toHaveBeenCalledWith(
        'task-1',
        'user-1',
      );
      expect(mockTaskRepository.delete).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException when delete fails', async () => {
      mockTaskRepository.findByIdAndUserId.mockResolvedValue({
        id: 'task-1',
        title: 'Test task',
        userId: 'user-1',
      });

      mockTaskRepository.delete.mockRejectedValue(new Error('DB delete failed'));

      await expect(service.delete('task-1', 'user-1')).rejects.toThrow(
        BadRequestException,
      );

      expect(mockTaskRepository.findByIdAndUserId).toHaveBeenCalledWith(
        'task-1',
        'user-1',
      );

      expect(mockTaskRepository.delete).toHaveBeenCalledWith('task-1');
    });
  });

  describe('create', () => {
    it('should create task successfully with trimmed values and default values', async () => {
      const dto = {
        title: '  Test task  ',
        description: '  Demo description  ',
      };

      const createdTask = {
        id: 'task-1',
        title: 'Test task',
        description: 'Demo description',
        status: 'NOT_STARTED',
        priority: 'LOW',
        categoryId: null,
        expiredAt: null,
      };

      mockTaskRepository.create.mockResolvedValue(createdTask);

      const result = await service.create(dto, 'user-1');

      expect(mockTaskRepository.create).toHaveBeenCalledWith('user-1', {
        title: 'Test task',
        description: 'Demo description',
        status: 'NOT_STARTED',
        priority: 'LOW',
        categoryId: null,
        expiredAt: null,
      });

      expect(result).toEqual(createdTask);
      expect(mockCategoryRepository.findByIdAndUserId).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException when category is invalid', async () => {
      const dto = {
        title: 'Test task',
        description: 'Demo',
        categoryId: 'cat-1',
      };

      mockCategoryRepository.findByIdAndUserId.mockResolvedValue(null);

      await expect(service.create(dto, 'user-1')).rejects.toThrow(
        NotFoundException,
      );

      expect(mockCategoryRepository.findByIdAndUserId).toHaveBeenCalledWith(
        'cat-1',
        'user-1',
      );

      expect(mockTaskRepository.create).not.toHaveBeenCalled();
    });

    it('should create task successfully when category is valid', async () => {
      const dto = {
        title: '  Test task  ',
        description: '  Demo description  ',
        categoryId: 'cat-1',
      };

      mockCategoryRepository.findByIdAndUserId.mockResolvedValue({
        id: 'cat-1',
        name: 'Work',
        userId: 'user-1',
      });

      mockTaskRepository.create.mockResolvedValue({
        id: 'task-1',
        title: 'Test task',
        description: 'Demo description',
        status: 'NOT_STARTED',
        priority: 'LOW',
        categoryId: 'cat-1',
        expiredAt: null,
      });

      const result = await service.create(dto, 'user-1');

      expect(mockCategoryRepository.findByIdAndUserId).toHaveBeenCalledWith(
        'cat-1',
        'user-1',
      );

      expect(mockTaskRepository.create).toHaveBeenCalledWith('user-1', {
        title: 'Test task',
        description: 'Demo description',
        status: 'NOT_STARTED',
        priority: 'LOW',
        categoryId: 'cat-1',
        expiredAt: null,
      });

      expect(result).toEqual({
        id: 'task-1',
        title: 'Test task',
        description: 'Demo description',
        status: 'NOT_STARTED',
        priority: 'LOW',
        categoryId: 'cat-1',
        expiredAt: null,
      });
    });



  });

  describe('update', () => {
    it('should update task successfully with trimmed values', async () => {
      const dto = {
        title: '  Updated task  ',
        description: '  Updated description  ',
      };

      const updatedTask = {
        id: 'task-1',
        title: 'Updated task',
        description: 'Updated description',
        status: 'NOT_STARTED',
        priority: 'LOW',
        categoryId: null,
        expiredAt: null,
      };

      mockTaskRepository.update.mockResolvedValue(updatedTask);

      const result = await service.update('task-1', 'user-1', dto);

      expect(mockTaskRepository.update).toHaveBeenCalledWith(
        'task-1',
        'user-1',
        {
          title: 'Updated task',
          description: 'Updated description',
          expiredAt: undefined,
        },
      );

      expect(result).toEqual(updatedTask);

      expect(mockCategoryRepository.findByIdAndUserId).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException when category is invalid', async () => {
      const dto = {
        title: 'Updated task',
        categoryId: 'cat-1',
      };

      mockCategoryRepository.findByIdAndUserId.mockResolvedValue(null);

      await expect(service.update('task-1', 'user-1', dto)).rejects.toThrow(
        NotFoundException,
      );

      expect(mockCategoryRepository.findByIdAndUserId).toHaveBeenCalledWith(
        'cat-1',
        'user-1',
      );

      expect(mockTaskRepository.update).not.toHaveBeenCalled();
    });

    it('should update task successfully with converted expiredAt', async () => {
      const dto = {
        expiredAt: '2026-04-02T10:00:00.000Z',
      };

      const updatedTask = {
        id: 'task-1',
        title: 'Test task',
        description: null,
        status: 'NOT_STARTED',
        priority: 'LOW',
        categoryId: null,
        expiredAt: new Date('2026-04-02T10:00:00.000Z'),
      };

      mockTaskRepository.update.mockResolvedValue(updatedTask);

      const result = await service.update('task-1', 'user-1', dto);

      expect(mockTaskRepository.update).toHaveBeenCalledWith(
        'task-1',
        'user-1',
        {
          expiredAt: new Date('2026-04-02T10:00:00.000Z'),
          title: undefined,
          description: undefined,
        },
      );

      expect(result).toEqual(updatedTask);
    });
  });


  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
