import React, { useState, useEffect } from 'react';
import { Layout, Card, Descriptions, Button, Space, Typography, Spin, message, Avatar } from 'antd';
import { ArrowLeftOutlined, UserOutlined, MailOutlined, BankOutlined, IdcardOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Layout/Navbar';
import api from '../../services/api';

const { Content } = Layout;
const { Title } = Typography;

const UserProfile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    setLoading(true);
    try {
      const response = await api.get('/user/profile/');
      console.log('User profile response:', response.data);

      // Handle different response formats
      if (response.data.success && response.data.data) {
        setProfile(response.data.data);
      } else if (response.data.user) {
        setProfile(response.data.user);
      } else {
        setProfile(response.data);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      message.error('Failed to load user profile');
    } finally {
      setLoading(false);
    }
  };

  const getUserInitials = () => {
    if (profile?.first_name && profile?.last_name) {
      return `${profile.first_name[0]}${profile.last_name[0]}`.toUpperCase();
    }
    if (profile?.first_name) {
      return profile.first_name[0].toUpperCase();
    }
    if (profile?.username) {
      return profile.username[0].toUpperCase();
    }
    return 'U';
  };

  const getFullName = () => {
    if (profile?.first_name && profile?.last_name) {
      return `${profile.first_name} ${profile.last_name}`;
    }
    if (profile?.first_name) {
      return profile.first_name;
    }
    return profile?.username || 'User';
  };

  return (
    <Layout className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <Navbar />
      <Content className="p-6 md:p-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <Space className="mb-4">
              <Button
                icon={<ArrowLeftOutlined />}
                onClick={() => navigate('/dashboard')}
                size="large"
                className="border-2 border-gray-300 hover:border-blue-500"
              >
                Back to Dashboard
              </Button>
            </Space>

            <Title level={2} className="text-gray-800 mb-2">
              User Profile
            </Title>
            <p className="text-gray-600 text-lg">
              View your account information
            </p>
          </div>

          {/* Profile Card */}
          {loading ? (
            <Card className="shadow-lg rounded-xl border-0">
              <div className="flex justify-center items-center py-20">
                <Spin size="large" />
              </div>
            </Card>
          ) : (
            <Card className="shadow-lg rounded-xl border-0">
              {/* Profile Header with Avatar */}
              <div className="flex items-center gap-6 mb-8 pb-6 border-b border-gray-200">
                <Avatar
                  size={100}
                  style={{
                    backgroundColor: '#2563eb',
                    fontSize: '40px',
                    fontWeight: 'bold',
                  }}
                  className="shadow-lg"
                >
                  {getUserInitials()}
                </Avatar>
                <div>
                  <h2 className="text-3xl font-bold text-gray-800 mb-2">
                    {getFullName()}
                  </h2>
                  <p className="text-gray-600 text-lg">
                    @{profile?.username || 'username'}
                  </p>
                </div>
              </div>

              {/* Profile Details */}
              <Descriptions
                bordered
                column={1}
                labelStyle={{
                  backgroundColor: '#f8fafc',
                  fontWeight: 600,
                  fontSize: '16px',
                  color: '#374151',
                  width: '200px',
                }}
                contentStyle={{
                  fontSize: '16px',
                  color: '#1f2937',
                  backgroundColor: '#ffffff',
                }}
              >
                <Descriptions.Item
                  label={
                    <span>
                      <UserOutlined className="mr-2 text-blue-600" />
                      Username
                    </span>
                  }
                >
                  {profile?.username || '-'}
                </Descriptions.Item>

                <Descriptions.Item
                  label={
                    <span>
                      <IdcardOutlined className="mr-2 text-green-600" />
                      First Name
                    </span>
                  }
                >
                  {profile?.first_name || '-'}
                </Descriptions.Item>

                <Descriptions.Item
                  label={
                    <span>
                      <IdcardOutlined className="mr-2 text-green-600" />
                      Last Name
                    </span>
                  }
                >
                  {profile?.last_name || '-'}
                </Descriptions.Item>

                <Descriptions.Item
                  label={
                    <span>
                      <MailOutlined className="mr-2 text-purple-600" />
                      Email
                    </span>
                  }
                >
                  {profile?.email || '-'}
                </Descriptions.Item>

                <Descriptions.Item
                  label={
                    <span>
                      <BankOutlined className="mr-2 text-orange-600" />
                      Organization
                    </span>
                  }
                >
                  {profile?.organization_name || 'Not specified'}
                </Descriptions.Item>
              </Descriptions>
            </Card>
          )}
        </div>
      </Content>
    </Layout>
  );
};

export default UserProfile;
