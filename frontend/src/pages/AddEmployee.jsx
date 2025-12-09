import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { ArrowLeft } from 'lucide-react';

import { MainLayout } from '../components/templates/MainLayout';
import { EmployeeForm } from '../components/organisms/EmployeeForm';
import { createEmployee } from '../services/employeeService';

export const AddEmployee = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createEmployee,
    onSuccess: () => {
      toast.success('Employee created successfully!');
      queryClient.invalidateQueries(['employees']);
      navigate('/employees');
    },
    onError: (error) => {
      const msg = error.response?.data?.message || error.message || 'Failed to create employee';
      toast.error(msg);
    },
  });

  const handleSubmit = (data) => {
    mutation.mutate(data);
  };

  return (
    <MainLayout>
      <div className="mb-6">
        <Link to="/employees" className="inline-flex items-center text-sm text-gray-500 hover:text-blue-600 mb-2">
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to List
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Add New Employee</h1>
        <p className="text-sm text-gray-500">Enter the details of the new team member.</p>
      </div>

      <EmployeeForm 
        onSubmit={handleSubmit} 
        isLoading={mutation.isPending} 
      />
    </MainLayout>
  );
};