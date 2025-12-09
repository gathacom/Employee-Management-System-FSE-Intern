import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Users, DollarSign, Briefcase } from 'lucide-react';
import { Link } from 'react-router-dom';

import { MainLayout } from '../components/templates/MainLayout';
import { Button } from '../components/atoms/Button';
import { getStats } from '../services/employeeService';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export const Dashboard = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['stats'],
    queryFn: getStats,
  });

  if (isLoading) {
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
        <div className="text-red-500 text-center mt-10">Failed to load dashboard statistics.</div>
      </MainLayout>
    );
  }

  const stats = data.data;
  const chartData = stats.department_breakdown;

  // Helper currency format
  const formatIDR = (val) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);

  return (
    <MainLayout>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500">Overview of your organization metrics.</p>
        </div>
        <Link to="/employees/new">
          <Button>+ Add Employee</Button>
        </Link>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Total Employees */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex items-center">
          <div className="p-3 bg-blue-100 rounded-full text-blue-600 mr-4">
            <Users className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Active Employees</p>
            <h3 className="text-3xl font-bold text-gray-900">{stats.total_active_employees}</h3>
          </div>
        </div>

        {/* Total Departments */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex items-center">
          <div className="p-3 bg-purple-100 rounded-full text-purple-600 mr-4">
            <Briefcase className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Departments</p>
            <h3 className="text-3xl font-bold text-gray-900">{stats.department_breakdown.length}</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex items-center">
          <div className="p-3 bg-green-100 rounded-full text-green-600 mr-4">
            <DollarSign className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Data Visualized</p>
            <h3 className="text-xl font-bold text-gray-900">Real-time</h3>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Chart: Employees per Department */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Employees by Department</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="department" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip 
                  cursor={{ fill: 'transparent' }}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]} barSize={50}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* List: Average Salary */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Average Salary per Department</h3>
          <div className="space-y-4">
            {stats.department_breakdown.map((dept, index) => (
              <div key={dept.department} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                  <span className="font-medium text-gray-700">{dept.department}</span>
                </div>
                <span className="font-mono font-semibold text-gray-900">
                  {formatIDR(dept.average_salary)}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-6 p-4 bg-blue-50 text-blue-700 text-sm rounded-md">
            <p>💡 Tip: Salaries shown are averages based on active employees only.</p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};