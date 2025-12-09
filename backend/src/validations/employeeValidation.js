import { z } from 'zod';

export const createEmployeeSchema = z.object({
  body: z.object({
    name: z.string().min(3, 'Name must be at least 3 characters'),
    email: z.string().email('Invalid email format'),
    position: z.string().min(2, 'Position is required'),
    department: z.string().min(2, 'Department is required'),
    salary: z.number().int().positive('Salary must be a positive integer'),
    hire_date: z.string().refine((date) => !isNaN(Date.parse(date)), {
      message: 'Invalid date format (expected YYYY-MM-DD)',
    }),
  }),
});

export const updateEmployeeSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, 'ID must be a number').transform(Number),
  }),
  body: z.object({
    name: z.string().min(3).optional(),
    email: z.string().email().optional(),
    position: z.string().optional(),
    department: z.string().optional(),
    salary: z.number().int().positive().optional(),
    hire_date: z.string().optional(),
    status: z.enum(['active', 'inactive']).optional(),
  }),
});

export const getEmployeeIdSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, 'ID must be a number').transform(Number),
  }),
});