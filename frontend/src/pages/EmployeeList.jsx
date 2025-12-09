import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Search, Edit2, Trash2, Filter } from "lucide-react";
import toast from "react-hot-toast";

// Components
import { MainLayout } from "../components/templates/MainLayout";
import { Button } from "../components/atoms/Button";
import { Input } from "../components/atoms/Input";
import { Badge } from "../components/atoms/Badge";
import { ConfirmModal } from "../components/molecules/ConfirmModal";
import { Pagination } from "../components/molecules/Pagination";
import { SelectField } from "../components/molecules/SelectField";

// Hooks & Services
import { useDebounce } from "../hooks/useDebounce";
import { getEmployees, deleteEmployee } from "../services/employeeService";

export const EmployeeList = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("");
  const [status, setStatus] = useState("");

  // State untuk Modal Delete
  const [deleteId, setDeleteId] = useState(null);

  // Debounce search agar tidak spam API
  const debouncedSearch = useDebounce(search, 500);

  // FETCH DATA
  const { data, isLoading, isError } = useQuery({
    queryKey: [
      "employees",
      { page, search: debouncedSearch, department, status },
    ],
    queryFn: () =>
      getEmployees({
        page,
        limit: 10,
        department,
        status,
        search: debouncedSearch, 
      }),
    placeholderData: (prev) => prev,
  });

  // DELETE MUTATION
  const deleteMutation = useMutation({
    mutationFn: deleteEmployee,
    onSuccess: () => {
      queryClient.invalidateQueries(["employees"]); 
      toast.success("Employee deactivated successfully");
      setDeleteId(null);
    },
    onError: (err) => {
      toast.error(err.message || "Failed to delete employee");
      setDeleteId(null);
    },
  });

  // HANDLERS 
  const handlePageChange = (newPage) => setPage(newPage);

  const handleDeleteConfirm = () => {
    if (deleteId) deleteMutation.mutate(deleteId);
  };

  return (
    <MainLayout>
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Employees</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage your team members and their accounts.
          </p>
        </div>
        <Link to="/employees/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Employee
          </Button>
        </Link>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6 space-y-4 md:space-y-0 md:flex md:items-end md:gap-4">
        {/* Search Input */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search employees..."
            className="pl-9"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>

        {/* Filters */}
        <div className="flex gap-4 w-full md:w-auto">
          <SelectField
            className="w-full md:w-40"
            placeholder="All Depts"
            options={[
              { label: "Technology", value: "Technology" },
              { label: "HR", value: "Human Resources" },
              { label: "Product", value: "Product" },
              { label: "Finance", value: "Finance" },
            ]}
            value={department}
            onChange={(e) => {
              setDepartment(e.target.value);
              setPage(1);
            }}
          />

          <SelectField
            className="w-full md:w-32"
            placeholder="All Status"
            options={[
              { label: "Active", value: "active" },
              { label: "Inactive", value: "inactive" },
            ]}
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(1);
            }}
          />
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Name
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Position
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Department
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Salary
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-6 py-4">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-4 bg-gray-200 rounded w-16"></div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-4 bg-gray-200 rounded w-20"></div>
                    </td>
                    <td className="px-6 py-4"></td>
                  </tr>
                ))
              ) : isError ? (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-10 text-center text-red-500"
                  >
                    Failed to load employees. Please try again.
                  </td>
                </tr>
              ) : data?.data?.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-10 text-center text-gray-500"
                  >
                    No employees found matching your criteria.
                  </td>
                </tr>
              ) : (
                // Real Data Mapping
                data?.data?.map((employee) => (
                  <tr
                    key={employee.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="ml-4">
                          <Link
                            to={`/employees/${employee.id}`}
                            className="text-sm font-medium text-gray-900 hover:text-blue-600 hover:underline"
                          >
                            {employee.name}
                          </Link>
                          <div className="text-sm text-gray-500">
                            {employee.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {employee.position}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {employee.department}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge status={employee.status}>{employee.status}</Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-mono">
                      {new Intl.NumberFormat("id-ID", {
                        style: "currency",
                        currency: "IDR",
                      }).format(employee.salary)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-blue-600 hover:text-blue-900"
                          onClick={() =>
                            navigate(`/employees/${employee.id}/edit`)
                          }
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-900"
                          onClick={() => setDeleteId(employee.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Component */}
        {!isLoading && !isError && data?.pagination && (
          <Pagination
            currentPage={data.pagination.page}
            totalPages={data.pagination.totalPages}
            totalItems={data.pagination.total}
            onPageChange={handlePageChange}
          />
        )}
      </div>

      {/* Confirmation Modal for Delete */}
      <ConfirmModal
        isOpen={!!deleteId}
        title="Delete Employee"
        message="Are you sure you want to deactivate this employee? They will be marked as inactive but not permanently deleted."
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteId(null)}
        isLoading={deleteMutation.isPending}
      />
    </MainLayout>
  );
};
