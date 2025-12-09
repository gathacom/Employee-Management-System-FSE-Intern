import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import { EmployeeList } from './pages/EmployeeList';
import { AddEmployee } from './pages/AddEmployee';
import { EditEmployee } from './pages/EditEmployee';
import { EmployeeDetail } from './pages/EmployeeDetail';
import { Dashboard } from './pages/Dashboard';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      {/* Employee Routes */}
      <Route path="/employees" element={<EmployeeList />} />
      <Route path="/employees/new" element={<AddEmployee />} />  
      <Route path="/employees/:id" element={<EmployeeDetail />} />
      <Route path="/employees/:id/edit" element={<EditEmployee />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;