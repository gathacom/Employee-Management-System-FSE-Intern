import express from 'express';
import {
  getAllEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  getStats,
} from '../controllers/employeeController.js';
import validate from '../middlewares/validate.js';
import {
  createEmployeeSchema,
  updateEmployeeSchema,
  getEmployeeIdSchema,
} from '../validations/employeeValidation.js';

const router = express.Router();

router.get('/stats', getStats);

router.get('/', getAllEmployees);
router.post('/', validate(createEmployeeSchema), createEmployee);

router.get('/:id', validate(getEmployeeIdSchema), getEmployeeById);
router.put('/:id', validate(updateEmployeeSchema), updateEmployee);
router.delete('/:id', validate(getEmployeeIdSchema), deleteEmployee);

export default router;