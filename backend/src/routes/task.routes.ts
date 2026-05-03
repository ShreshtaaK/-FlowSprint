import { Router } from 'express'
import {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  updateTaskStatus,
  deleteTask
} from '../controllers/task.controller'
import {
  createTaskValidation,
  updateTaskValidation,
  updateStatusValidation
} from '../validations/task.validation'
import { protect } from '../middleware/auth.middleware'

const router = Router()

// All task routes are protected
router.use(protect)

router.post('/', createTaskValidation, createTask)
router.get('/', getTasks)
router.get('/:id', getTaskById)
router.put('/:id', updateTaskValidation, updateTask)
router.patch('/:id/status', updateStatusValidation, updateTaskStatus)
router.delete('/:id', deleteTask)

export default router