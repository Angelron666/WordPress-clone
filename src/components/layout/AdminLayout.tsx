import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';

const AdminLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-wordpress-gray font-wp">
      <Header />
      <Sidebar />
      <main className="pt-12 ml-64 min-h-screen">
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;