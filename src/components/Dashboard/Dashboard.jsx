import React, { useState } from 'react';
import { Layout, Card, Upload, Button, message, Typography, Space } from 'antd';
import { UploadOutlined, InboxOutlined, DownloadOutlined, FileTextOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Layout/Navbar';
import uploadExcelFile from '../../services/upload.service';

const { Content } = Layout;
const { Title, Paragraph } = Typography;
const { Dragger } = Upload;

const Dashboard = () => {
  const navigate = useNavigate();
  const [fileList, setFileList] = useState([]);
  const [uploading, setUploading] = useState(false);

  const requiredColumns = [
    'Employee ID',
    'Employee Name',
    'Basic Salary',
    'Allowances',
    'Deductions',
    'Working Days',
    'Present Days',
  ];

  const handleUpload = async () => {
    if (fileList.length === 0) {
      message.warning('Please select an Excel file first');
      return;
    }

    setUploading(true);

    console.log('Starting file upload...', {
      fileName: fileList[0].name,
      fileSize: fileList[0].size,
      fileType: fileList[0].type
    });

    try {
      const response = await uploadExcelFile(fileList[0]);

      // Log the complete API response
      console.log('Upload API Response:', response);
      console.log('Upload Status:', response.success);
      console.log('Upload Message:', response.message);
      console.log('Upload Data:', response.data);

      if (response.success) {
        console.log('File uploaded successfully!', {
          uploadId: response.data.id,
          totalEmployees: response.data.total_employees,
          status: response.data.status,
          filename: response.data.filename,
          uploadDate: response.data.upload_date
        });

        message.success(response.message || `File processed successfully! ${response.data.total_employees} employees loaded.`);

        // Show warnings if any
        if (response.warnings && response.warnings.length > 0) {
          console.warn('Upload Warnings:', response.warnings);
          response.warnings.forEach(warning => {
            message.warning(warning);
          });
        }

        setFileList([]);
      }
    } catch (error) {
      console.error('Upload error:', error);
      console.error('Error details:', {
        message: error.message,
        errors: error.errors,
        fullError: error
      });

      if (error.errors && Array.isArray(error.errors)) {
        error.errors.forEach(err => {
          message.error(err);
        });
      } else if (error.message) {
        message.error(error.message);
      } else {
        message.error('Failed to upload file. Please try again.');
      }
    } finally {
      setUploading(false);
    }
  };

  const handleDownloadTemplate = () => {
    // Download the custom Excel template from public folder
    const link = document.createElement('a');
    link.href = '/sample_payroll_template.xlsx';
    link.download = 'sample_payroll_template.xlsx';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    message.success('Template downloaded successfully!');
  };

  const uploadProps = {
    name: 'file',
    multiple: false,
    fileList,
    accept: '.xlsx,.xls',
    beforeUpload: (file) => {
      const isExcel =
        file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
        file.type === 'application/vnd.ms-excel';

      if (!isExcel) {
        message.error('You can only upload Excel files (.xlsx, .xls)!');
        return Upload.LIST_IGNORE;
      }

      const isLt10M = file.size / 1024 / 1024 < 10;
      if (!isLt10M) {
        message.error('File must be smaller than 10MB!');
        return Upload.LIST_IGNORE;
      }

      setFileList([file]);
      return false;
    },
    onRemove: () => {
      setFileList([]);
    },
  };

  return (
    <Layout className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <Navbar />
      <Content className="p-6 md:p-8">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <Title level={2} className="text-gray-800 mb-2">
              Welcome to Payroll Management System
            </Title>
            <Paragraph className="text-gray-600 text-lg">
              Upload your employee payroll Excel file to get started with processing
            </Paragraph>
          </div>

          {/* Summary Button */}
          <div className="mb-6">
            <Button
              type="default"
              icon={<FileTextOutlined />}
              onClick={() => navigate('/summary')}
              size="large"
              className="h-12 text-lg font-semibold border-2 border-blue-600 text-blue-600 hover:bg-blue-50 hover:border-blue-700 hover:text-blue-700"
            >
              View Summary
            </Button>
          </div>

          {/* Main Upload Card */}
          <Card
            className="shadow-lg rounded-lg border-0 mb-6"
            bodyStyle={{ padding: '40px' }}
          >
            <Space direction="vertical" size="large" className="w-full">
              {/* Upload Area */}
              <Dragger {...uploadProps} className="bg-white hover:bg-blue-50 transition-colors border-2 border-dashed border-blue-300">
                <p className="ant-upload-drag-icon">
                  <InboxOutlined className="text-blue-600 text-6xl" />
                </p>
                <p className="ant-upload-text text-gray-800 text-lg font-semibold">
                  Click or drag Excel file to this area
                </p>
                <p className="ant-upload-hint text-gray-500">
                  Support for .xlsx and .xls files only. Maximum file size: 10MB
                </p>
              </Dragger>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Download Template Button */}
                <Button
                  type="default"
                  icon={<DownloadOutlined />}
                  onClick={handleDownloadTemplate}
                  size="large"
                  className="h-12 text-lg font-semibold border-2 border-blue-600 text-blue-600 hover:bg-blue-50 hover:border-blue-700 hover:text-blue-700"
                >
                  Download Template
                </Button>

                {/* Upload Button */}
                <Button
                  type="primary"
                  icon={<UploadOutlined />}
                  onClick={handleUpload}
                  loading={uploading}
                  disabled={fileList.length === 0}
                  size="large"
                  className="h-12 text-lg font-semibold bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300"
                >
                  {uploading ? 'Uploading...' : 'Upload and Process'}
                </Button>
              </div>
            </Space>
          </Card>

        </div>
      </Content>
    </Layout>
  );
};

export default Dashboard;
