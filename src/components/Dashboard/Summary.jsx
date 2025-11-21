import React, { useState, useEffect } from 'react';
import { Layout, Table, Button, Typography, Card, message, Space, Popconfirm } from 'antd';
import { EyeOutlined, ArrowLeftOutlined, DownloadOutlined, DeleteOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Layout/Navbar';
import payrollService from '../../services/payroll.service';

const { Content } = Layout;
const { Title } = Typography;

const Summary = () => {
  const navigate = useNavigate();
  const [uploads, setUploads] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUploadedFiles();
  }, []);

  const fetchUploadedFiles = async () => {
    setLoading(true);
    try {
      const response = await payrollService.getUploadedFiles();
      console.log('Fetched uploads:', response);

      // Handle different response formats
      let uploadsList = [];
      if (response.success && Array.isArray(response.data)) {
        uploadsList = response.data;
      } else if (Array.isArray(response)) {
        uploadsList = response;
      } else if (response.results && Array.isArray(response.results)) {
        uploadsList = response.results;
      }

      setUploads(uploadsList);
    } catch (error) {
      console.error('Error fetching uploads:', error);
      message.error('Failed to fetch uploaded files');
    } finally {
      setLoading(false);
    }
  };

  const handleView = (record) => {
    console.log('View file:', record);
    // Navigate to payroll details page with upload ID
    navigate(`/payroll-details/${record.id}`);
  };

  const handleDownload = async (record) => {
    try {
      message.loading({ content: 'Downloading payroll...', key: 'download' });
      // TODO: Implement full payroll download
      // This would download the original Excel file
      const link = document.createElement('a');
      link.href = `https://app-a-p-p-adqaj.ondigitalocean.app${record.file}`;
      link.download = record.filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      message.success({ content: 'Download started!', key: 'download' });
    } catch (error) {
      console.error('Download error:', error);
      message.error({ content: 'Failed to download', key: 'download' });
    }
  };

  const handleDelete = (record) => {
    // Remove from UI (no API call)
    const updatedUploads = uploads.filter(upload => upload.id !== record.id);
    setUploads(updatedUploads);
    message.success('File removed from view');
  };

  const columns = [
    {
      title: 'File Name',
      dataIndex: 'filename',
      key: 'filename',
      render: (text, record) => (
        <div>
          <div className="font-semibold text-gray-800">{text}</div>
          <div className="text-sm text-gray-500">
            Uploaded: {new Date(record.upload_date).toLocaleString()}
          </div>
        </div>
      ),
    },
    {
      title: 'Employees',
      dataIndex: 'total_employees',
      key: 'total_employees',
      align: 'center',
      render: (count) => (
        <span className="font-semibold text-blue-600">{count || 0}</span>
      ),
    },
    {
      title: 'View',
      key: 'view',
      align: 'center',
      render: (_, record) => (
        <Button
          type="primary"
          icon={<EyeOutlined />}
          onClick={() => handleView(record)}
          className="bg-blue-600 hover:bg-blue-700"
        >
          View
        </Button>
      ),
    },
    {
      title: 'Download',
      key: 'download',
      align: 'center',
      render: (_, record) => (
        <Button
          type="default"
          icon={<DownloadOutlined />}
          onClick={() => handleDownload(record)}
          className="border-2 border-green-600 text-green-600 hover:bg-green-50"
        >
          Download
        </Button>
      ),
    },
    {
      title: 'Delete',
      key: 'delete',
      align: 'center',
      render: (_, record) => (
        <Popconfirm
          title="Delete this file?"
          description="This will remove the file from view. Are you sure?"
          onConfirm={() => handleDelete(record)}
          okText="Yes, Delete"
          cancelText="Cancel"
          okButtonProps={{ danger: true }}
        >
          <Button
            type="default"
            danger
            icon={<DeleteOutlined />}
            className="border-2 border-red-600 text-red-600 hover:bg-red-50"
          >
            Delete
          </Button>
        </Popconfirm>
      ),
    },
  ];

  return (
    <Layout className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <Navbar />
      <Content className="p-6 md:p-8">
        <div className="max-w-6xl mx-auto">
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
              Uploaded Files Summary
            </Title>
            <p className="text-gray-600 text-lg">
              View all your uploaded payroll files and their status
            </p>
          </div>

          {/* Table Card */}
          <Card className="shadow-lg rounded-lg border-0">
            <Table
              columns={columns}
              dataSource={uploads}
              rowKey="id"
              loading={loading}
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showTotal: (total) => `Total ${total} files`,
              }}
              className="custom-table"
            />
          </Card>
        </div>
      </Content>
    </Layout>
  );
};

export default Summary;
