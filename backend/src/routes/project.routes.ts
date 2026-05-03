import { Router } from 'express'
import {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject
} from '../controllers/project.controller'
import {
  createProjectValidation,
  updateProjectValidation
} from '../validations/project.validation'
import { protect } from '../middleware/auth.middleware'

const router = Router()

// All project routes are protected
router.use(protect)

router.post('/', createProjectValidation, createProject)
router.get('/', getProjects)
router.get('/:id', getProjectById)
router.put('/:id', updateProjectValidation, updateProject)
router.delete('/:id', deleteProject)

export default router