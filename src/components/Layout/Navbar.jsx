import React, { useState } from 'react';
import { Layout, Button, Space, Avatar, message } from 'antd';
import { LogoutOutlined, UserOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import authService from '../../services/auth.service';

const { Header } = Layout;

const Navbar = () => {
  const navigate = useNavigate();
  const user = authService.getCurrentUser();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await authService.logout();
      message.success('Logout successful');
      // Force a complete page reload to clear any cached state
      window.location.href = '/login';
    } catch (error) {
      console.error('Logout error:', error);
      message.error('Logout failed');
      setLoading(false);
    }
  };

  const getUserDisplayName = () => {
    if (user?.first_name && user?.last_name) {
      return `${user.first_name} ${user.last_name}`;
    }
    if (user?.first_name) {
      return user.first_name;
    }
    return user?.username || 'User';
  };

  const getUserInitials = () => {
    if (user?.first_name && user?.last_name) {
      return `${user.first_name[0]}${user.last_name[0]}`.toUpperCase();
    }
    if (user?.first_name) {
      return user.first_name[0].toUpperCase();
    }
    if (user?.username) {
      return user.username[0].toUpperCase();
    }
    return 'U';
  };

  return (
    <Header className="bg-white shadow-md px-6 flex items-center justify-between sticky top-0 z-50 h-20">
      <div className="flex items-center gap-3">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl shadow-lg">
            <span className="text-white text-3xl font-bold">P</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 hidden md:block">
            Payroll Management
          </h1>
        </div>
      </div>

      {/* User Info & Logout */}
      <div className="flex items-center gap-4">
        {/* User Info Display */}
        <div className="flex items-center gap-3 px-4 py-2 bg-blue-50 rounded-lg">
          <Avatar
            style={{
              backgroundColor: '#2563eb',
              verticalAlign: 'middle',
            }}
            size="large"
          >
            {getUserInitials()}
          </Avatar>
          <div className="hidden md:block">
            <div className="text-gray-800 font-semibold text-base">
              {getUserDisplayName()}
            </div>
            <div className="text-gray-500 text-sm">
              {user?.email || 'User'}
            </div>
          </div>
        </div>

        {/* Logout Button */}
        <Button
          type="primary"
          danger
          icon={<LogoutOutlined style={{ fontSize: '18px' }} />}
          onClick={handleLogout}
          loading={loading}
          size="large"
          className="bg-red-500 hover:bg-red-600 border-0 h-12 px-6 flex items-center gap-2"
        >
          <span className="hidden md:inline text-base font-semibold">Logout</span>
        </Button>
      </div>
    </Header>
  );
};

export default Navbar;
