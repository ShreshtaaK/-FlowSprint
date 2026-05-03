import { body } from 'express-validator'

export const createTaskValidation = [
  body('title')
    .trim()
    .notEmpty().withMessage('Task title is required')
    .isLength({ min: 3 }).withMessage('Title must be at least 3 characters'),

  body('description')
    .trim()
    .notEmpty().withMessage('Description is required'),

  body('priority')
    .notEmpty().withMessage('Priority is required')
    .isIn(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'])
    .withMessage('Priority must be LOW, MEDIUM, HIGH or CRITICAL'),

  body('dueDate')
    .notEmpty().withMessage('Due date is required')
    .isISO8601().withMessage('Invalid due date format'),

  body('assigneeId')
    .notEmpty().withMessage('Assignee is required'),

  body('projectId')
    .notEmpty().withMessage('Project ID is required')
]

export const updateTaskValidation = [
  body('title')
    .optional()
    .trim()
    .isLength({ min: 3 }).withMessage('Title must be at least 3 characters'),

  body('description')
    .optional()
    .trim()
    .notEmpty().withMessage('Description cannot be empty'),

  body('priority')
    .optional()
    .isIn(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'])
    .withMessage('Priority must be LOW, MEDIUM, HIGH or CRITICAL'),

  body('dueDate')
    .optional()
    .isISO8601().withMessage('Invalid due date format'),

  body('assigneeId')
    .optional()
    .notEmpty().withMessage('Assignee cannot be empty')
]

export const updateStatusValidation = [
  body('status')
    .notEmpty().withMessage('Status is required')
    .isIn(['TODO', 'IN_PROGRESS', 'REVIEW', 'COMPLETED'])
    .withMessage('Status must be TODO, IN_PROGRESS, REVIEW or COMPLETED')
]