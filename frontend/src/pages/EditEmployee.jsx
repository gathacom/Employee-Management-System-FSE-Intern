import React from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { ArrowLeft } from 'lucide-react';

import { MainLayout } from '../components/templates/MainLayout';
import { EmployeeForm } from '../components/organisms/EmployeeForm';
import { getEmployeeById, updateEmployee } from '../services/employeeService';

export const EditEmployee = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Fetch Existing Data
  const { data, isLoading: isFetching, isError } = useQuery({
    queryKey: ['employee', id],
    queryFn: () => getEmployeeById(id),
    enabled: !!id, 
  });

  // Setup Mutation Update
  const mutation = useMutation({
    mutationFn: (formData) => updateEmployee(id, formData),
    onSuccess: () => {
      toast.success('Employee updated successfully!');
      queryClient.invalidateQueries(['employees']);
      queryClient.invalidateQueries(['employee', id]);
      navigate('/employees');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update employee');
    },
  });

  const handleSubmit = (formData) => {
    mutation.mutate(formData);
  };

  if (isFetching) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </MainLayout>
    );
  }

  if (isError) {
    return (
      <MainLayout>
        <div className="text-center text-red-500 mt-10">
          Error loading employee data.
        </div>
      </MainLayout>
    );
  }

  const initialData = {
    ...data.data,
    hire_date: data.data.hire_date.split('T')[0],
  };

  return (
    <MainLayout>
      <div className="mb-6">
        <Link to="/employees" className="inline-flex items-center text-sm text-gray-500 hover:text-blue-600 mb-2">
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to List
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Edit Employee</h1>
        <p className="text-sm text-gray-500">Update information for {initialData.name}.</p>
      </div>

      <EmployeeForm 
        initialData={initialData} 
        onSubmit={handleSubmit} 
        isLoading={mutation.isPending} 
        isEditMode={true}
      />
    </MainLayout>
  );
};