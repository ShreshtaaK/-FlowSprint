import { body } from 'express-validator'

export const createProjectValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('Project name is required')
    .isLength({ min: 3 }).withMessage('Name must be at least 3 characters'),

  body('description')
    .trim()
    .notEmpty().withMessage('Description is required'),

  body('startDate')
    .notEmpty().withMessage('Start date is required')
    .isISO8601().withMessage('Invalid start date format'),

  body('dueDate')
    .notEmpty().withMessage('Due date is required')
    .isISO8601().withMessage('Invalid due date format')
]

export const updateProjectValidation = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 3 }).withMessage('Name must be at least 3 characters'),

  body('description')
    .optional()
    .trim()
    .notEmpty().withMessage('Description cannot be empty'),

  body('dueDate')
    .optional()
    .isISO8601().withMessage('Invalid due date format')
]