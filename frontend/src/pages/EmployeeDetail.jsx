import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { Edit2, Trash2, Mail, Briefcase, Building2, Calendar, DollarSign, User } from 'lucide-react';

import { MainLayout } from '../components/templates/MainLayout';
import { Breadcrumb } from '../components/molecules/Breadcrumb';
import { Badge } from '../components/atoms/Badge';
import { Button } from '../components/atoms/Button';
import { ConfirmModal } from '../components/molecules/ConfirmModal';
import { getEmployeeById, deleteEmployee } from '../services/employeeService';

export const EmployeeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['employee', id],
    queryFn: () => getEmployeeById(id),
    enabled: !!id,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteEmployee,
    onSuccess: () => {
      toast.success('Employee deactivated successfully');
      queryClient.invalidateQueries(['employees']);
      navigate('/employees');
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to delete employee');
      setIsDeleteModalOpen(false);
    },
  });

  if (isLoading) return <MainLayout><div className="p-8 text-center">Loading details...</div></MainLayout>;
  if (isError) return <MainLayout><div className="p-8 text-center text-red-500">Employee not found</div></MainLayout>;

  const employee = data.data;

  const formatCurrency = (value) => 
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(value);

  const formatDate = (dateString) => 
    new Date(dateString).toLocaleDateString('en-GB', { 
      day: 'numeric', month: 'long', year: 'numeric' 
    });

  return (
    <MainLayout>
      {/* Breadcrumb */}
      <div className="mb-6">
        <Breadcrumb 
          items={[
            { label: 'Employees', to: '/employees' },
            { label: employee.name }
          ]} 
        />
      </div>

      {/* Header with Actions */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-2xl font-bold">
            {employee.name.charAt(0)}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{employee.name}</h1>
            <p className="text-gray-500">{employee.position}</p>
          </div>
        </div>
        
        <div className="flex gap-3">
          <Link to={`/employees/${id}/edit`}>
            <Button variant="secondary">
              <Edit2 className="w-4 h-4 mr-2" />
              Edit
            </Button>
          </Link>
          <Button variant="danger" onClick={() => setIsDeleteModalOpen(true)}>
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      {/* Detail Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Main Info */}
        <div className="md:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <User className="w-5 h-5 text-gray-400" />
            Personal Information
          </h2>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
               <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase">Email Address</label>
                  <div className="flex items-center gap-2 mt-1 text-gray-900">
                    <Mail className="w-4 h-4 text-gray-400" />
                    {employee.email}
                  </div>
               </div>
               <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase">Status</label>
                  <div className="mt-1">
                    <Badge status={employee.status}>{employee.status}</Badge>
                  </div>
               </div>
            </div>
          </div>
        </div>

        {/* Card 2: Employment Info */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-gray-400" />
            Employment
          </h2>
          
          <div className="space-y-4">
            <div>
               <label className="text-xs font-semibold text-gray-500 uppercase">Department</label>
               <div className="flex items-center gap-2 mt-1 text-gray-900">
                 <Building2 className="w-4 h-4 text-gray-400" />
                 {employee.department}
               </div>
            </div>
            
            <div className="pt-4 border-t border-gray-100">
               <label className="text-xs font-semibold text-gray-500 uppercase">Join Date</label>
               <div className="flex items-center gap-2 mt-1 text-gray-900">
                 <Calendar className="w-4 h-4 text-gray-400" />
                 {formatDate(employee.hire_date)}
               </div>
            </div>

            <div className="pt-4 border-t border-gray-100">
               <label className="text-xs font-semibold text-gray-500 uppercase">Salary</label>
               <div className="flex items-center gap-2 mt-1 text-gray-900 font-medium">
                 <DollarSign className="w-4 h-4 text-gray-400" />
                 {formatCurrency(employee.salary)}
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        title="Delete Employee"
        message={`Are you sure you want to deactivate ${employee.name}?`}
        onConfirm={() => deleteMutation.mutate(id)}
        onCancel={() => setIsDeleteModalOpen(false)}
        isLoading={deleteMutation.isPending}
      />
    </MainLayout>
  );
};