import React, { useState, useEffect } from 'react';
import { Layout, Table, Button, Typography, Card, message, Space, Spin } from 'antd';
import { ArrowLeftOutlined, DownloadOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../Layout/Navbar';
import payrollService from '../../services/payroll.service';

const { Content } = Layout;
const { Title } = Typography;

const PayrollDetails = () => {
  const navigate = useNavigate();
  const { uploadId } = useParams();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploadInfo, setUploadInfo] = useState(null);

  useEffect(() => {
    fetchEmployeeData();
  }, [uploadId]);

  const fetchEmployeeData = async () => {
    setLoading(true);
    try {
      const response = await payrollService.getEmployeesByUploadId(uploadId);
      console.log('Employee data:', response);

      // Handle different response formats
      let employeesList = [];
      let info = null;

      if (response.success && Array.isArray(response.data)) {
        employeesList = response.data;
        info = response.upload_info;
      } else if (Array.isArray(response)) {
        employeesList = response;
      } else if (response.results && Array.isArray(response.results)) {
        employeesList = response.results;
      } else if (response.employees && Array.isArray(response.employees)) {
        employeesList = response.employees;
        info = response.upload_info;
      }

      setEmployees(employeesList);
      setUploadInfo(info);
    } catch (error) {
      console.error('Error fetching employee data:', error);
      message.error('Failed to fetch employee data');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadRow = async (employee) => {
    try {
      message.loading({ content: 'Downloading employee data...', key: 'download-row' });

      // Create CSV data for single employee
      const headers = Object.keys(employee).join(',');
      const values = Object.values(employee).join(',');
      const csvContent = `${headers}\n${values}`;

      // Create download link
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `employee_${employee.id || employee.employee_id}_payroll.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      message.success({ content: 'Download completed!', key: 'download-row' });
    } catch (error) {
      console.error('Download error:', error);
      message.error({ content: 'Failed to download', key: 'download-row' });
    }
  };

  // Dynamically generate columns based on employee data
  const generateColumns = () => {
    if (employees.length === 0) return [];

    const firstEmployee = employees[0];
    const dataColumns = Object.keys(firstEmployee).map((key) => ({
      title: key.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()),
      dataIndex: key,
      key: key,
      render: (text) => (
        <span className="text-gray-800">{text !== null && text !== undefined ? text : '-'}</span>
      ),
    }));

    // Add download column at the end
    dataColumns.push({
      title: 'Download',
      key: 'download',
      align: 'center',
      fixed: 'right',
      width: 120,
      render: (_, record) => (
        <Button
          type="default"
          icon={<DownloadOutlined />}
          onClick={() => handleDownloadRow(record)}
          size="small"
          className="border-2 border-green-600 text-green-600 hover:bg-green-50"
        />
      ),
    });

    return dataColumns;
  };

  return (
    <Layout className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <Navbar />
      <Content className="p-6 md:p-8">
        <div className="max-w-full mx-auto">
          {/* Header */}
          <div className="mb-6">
            <Space className="mb-4">
              <Button
                icon={<ArrowLeftOutlined />}
                onClick={() => navigate('/summary')}
                size="large"
                className="border-2 border-gray-300 hover:border-blue-500"
              >
                Back to Summary
              </Button>
            </Space>

            <Title level={2} className="text-gray-800 mb-2">
              Payroll Details
            </Title>
            <p className="text-gray-600 text-lg">
              {uploadInfo ? `File: ${uploadInfo.filename}` : 'View detailed employee payroll data'}
            </p>
          </div>

          {/* Table Card */}
          <Card className="shadow-lg rounded-lg border-0">
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <Spin size="large" />
              </div>
            ) : (
              <Table
                columns={generateColumns()}
                dataSource={employees}
                rowKey={(record) => record.id || record.employee_id || Math.random()}
                scroll={{ x: 'max-content' }}
                pagination={{
                  pageSize: 10,
                  showSizeChanger: true,
                  showTotal: (total) => `Total ${total} employees`,
                }}
                className="custom-table"
              />
            )}
          </Card>
        </div>
      </Content>
    </Layout>
  );
};

export default PayrollDetails;
