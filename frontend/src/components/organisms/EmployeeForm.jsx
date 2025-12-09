import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { Save, ArrowLeft } from 'lucide-react';

// Components
import { Button } from '../atoms/Button';
import { FormField } from '../molecules/FormField';
import { SelectField } from '../molecules/SelectField';
import { employeeSchema } from '../../utils/schemas';

export const EmployeeForm = ({ initialData, onSubmit, isLoading, isEditMode = false }) => {
  const { 
    register, 
    handleSubmit, 
    formState: { errors } 
  } = useForm({
    resolver: zodResolver(employeeSchema),
    defaultValues: initialData || {
      name: '',
      email: '',
      position: '',
      department: '',
      salary: '',
      hire_date: new Date().toISOString().split('T')[0], // Default today (YYYY-MM-DD)
      status: 'active',
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white p-6 md:p-8 rounded-lg shadow-sm border border-gray-200">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Kolom Kiri */}
        <div className="space-y-6">
          <FormField
            label="Full Name"
            placeholder="e.g. Budi Santoso"
            registration={register('name')}
            error={errors.name}
          />
          
          <FormField
            label="Email Address"
            type="email"
            placeholder="budi@company.com"
            registration={register('email')}
            error={errors.email}
          />

          <FormField
            label="Job Position"
            placeholder="e.g. Backend Engineer"
            registration={register('position')}
            error={errors.position}
          />
        </div>

        {/* Kolom Kanan */}
        <div className="space-y-6">
          <SelectField
            label="Department"
            placeholder="Select Department"
            options={[
              { label: 'Technology', value: 'Technology' },
              { label: 'Human Resources', value: 'Human Resources' },
              { label: 'Product', value: 'Product' },
              { label: 'Finance', value: 'Finance' },
              { label: 'Marketing', value: 'Marketing' },
            ]}
            {...register('department')}
            error={errors.department}
          />

          <FormField
            label="Salary (IDR)"
            type="number"
            placeholder="e.g. 15000000"
            registration={register('salary')}
            error={errors.salary}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              label="Hire Date"
              type="date"
              registration={register('hire_date')}
              error={errors.hire_date}
            />

            {/* Status Field hanya muncul saat Edit Mode */}
            {isEditMode && (
              <SelectField
                label="Status"
                options={[
                  { label: 'Active', value: 'active' },
                  { label: 'Inactive', value: 'inactive' },
                ]}
                {...register('status')}
                error={errors.status}
              />
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
        <Link to="/employees">
          <Button variant="secondary" type="button">
            Cancel
          </Button>
        </Link>
        <Button type="submit" isLoading={isLoading}>
          <Save className="w-4 h-4 mr-2" />
          {isEditMode ? 'Update Employee' : 'Create Employee'}
        </Button>
      </div>
    </form>
  );
};