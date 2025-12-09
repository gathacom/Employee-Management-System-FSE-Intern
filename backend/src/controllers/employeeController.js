import prisma from '../config/prisma.js';
import { StatusCodes } from 'http-status-codes';

// Get All Employees 
export const getAllEmployees = async (req, res) => {
  const { page = 1, limit = 10, department, status, search } = req.query; 
  const skip = (page - 1) * limit;

  const whereClause = {};

  if (department) whereClause.department = { contains: department, mode: 'insensitive' };
  if (status) whereClause.status = status;

  if (search) {
    whereClause.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { email: { contains: search, mode: 'insensitive' } },
      { position: { contains: search, mode: 'insensitive' } },
    ];
  }

  const [employees, total] = await prisma.$transaction([
    prisma.employee.findMany({
      where: whereClause,
      skip: parseInt(skip),
      take: parseInt(limit),
      orderBy: { id: 'desc' },
    }),
    prisma.employee.count({ where: whereClause }),
  ]);

  res.status(StatusCodes.OK).json({
    message: 'Employees retrieved successfully',
    data: employees,
    pagination: {
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / limit),
    },
  });
};

// Get Employee By ID
export const getEmployeeById = async (req, res) => {
  const { id } = req.params; 

  const employee = await prisma.employee.findUnique({
    where: { id },
  });

  if (!employee) {
    throw { statusCode: StatusCodes.NOT_FOUND, message: 'Employee not found' };
  }

  res.status(StatusCodes.OK).json({
    message: 'Employee detail retrieved',
    data: employee,
  });
};

// Create New Employee
export const createEmployee = async (req, res) => {
  const { name, email, position, department, salary, hire_date } = req.body;
  const existingUser = await prisma.employee.findUnique({ where: { email } });
  if (existingUser) {
    throw { statusCode: StatusCodes.CONFLICT, message: 'Email already exists' };
  }

  const newEmployee = await prisma.employee.create({
    data: {
      name,
      email,
      position,
      department,
      salary,
      hire_date: new Date(hire_date), 
    },
  });

  res.status(StatusCodes.CREATED).json({
    message: 'Employee created successfully',
    data: newEmployee,
  });
};

// Update Employee
export const updateEmployee = async (req, res) => {
  const { id } = req.params;
  const data = req.body;

  if (data.hire_date) {
    data.hire_date = new Date(data.hire_date);
  }

  const exists = await prisma.employee.findUnique({ where: { id } });
  if (!exists) throw { statusCode: StatusCodes.NOT_FOUND, message: 'Employee not found' };

  const updatedEmployee = await prisma.employee.update({
    where: { id },
    data: data,
  });

  res.status(StatusCodes.OK).json({
    message: 'Employee updated successfully',
    data: updatedEmployee,
  });
};

// Delete Employee (Soft Delete)
export const deleteEmployee = async (req, res) => {
  const { id } = req.params;

  const exists = await prisma.employee.findUnique({ where: { id } });
  if (!exists) throw { statusCode: StatusCodes.NOT_FOUND, message: 'Employee not found' };

  // Soft Delete: Hanya update status jadi 'inactive'
  await prisma.employee.update({
    where: { id },
    data: { status: 'inactive' },
  });

  res.status(StatusCodes.OK).json({
    message: 'Employee deactivated successfully (Soft Delete)',
    data: null,
  });
};

// Get Statistics
export const getStats = async (req, res) => {
  const [totalEmployees, departmentStats] = await prisma.$transaction([
    prisma.employee.count({ where: { status: 'active' } }),
    
    // Group By Department (Count & Avg Salary)
    prisma.employee.groupBy({
      by: ['department'],
      _count: { id: true },
      _avg: { salary: true },
      where: { status: 'active' },
    }),
  ]);

  res.status(StatusCodes.OK).json({
    message: 'Statistics retrieved',
    data: {
      total_active_employees: totalEmployees,
      department_breakdown: departmentStats.map(dept => ({
        department: dept.department,
        count: dept._count.id,
        average_salary: Math.round(dept._avg.salary),
      })),
    },
  });
};