import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import { UserOutlined, MailOutlined, LockOutlined, IdcardOutlined, BankOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import authService from '../../services/auth.service';
import authIllustration from '../../assets/images/auth-illustration.png';
import payorbitLogo from '../../assets/images/payorbit.png';

const Register = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      console.log('Submitting registration with values:', values);
      const response = await authService.register(values);
      console.log('Registration response:', response);

      if (response.success) {
        message.success(response.message || 'Registration successful! Please login.');
        setTimeout(() => {
          navigate('/login');
        }, 1000);
      } else {
        message.error(response.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);

      // Handle error response
      const errors = error.errors;
      if (errors && Object.keys(errors).length > 0) {
        // Display specific field errors
        Object.keys(errors).forEach((field) => {
          const errorMessages = errors[field];
          if (Array.isArray(errorMessages)) {
            errorMessages.forEach((msg) => message.error(`${field}: ${msg}`));
          } else {
            message.error(`${field}: ${errorMessages}`);
          }
        });
      } else {
        message.error(error.message || 'Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const validatePassword = (_, value) => {
    if (!value) {
      return Promise.reject(new Error('Please input your password!'));
    }
    if (value.length < 8) {
      return Promise.reject(new Error('Password must be at least 8 characters long!'));
    }
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/.test(value)) {
      return Promise.reject(
        new Error('Password must contain uppercase, lowercase, number and special character!')
      );
    }
    return Promise.resolve();
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-blue-50 to-white">
      {/* Left Side - Illustration */}
      <div className="hidden lg:flex lg:w-1/2 bg-white items-center justify-center p-8 shadow-lg">
        <div className="w-full px-8 text-center">
          <img
            src={authIllustration}
            alt="Payroll Management"
            className="w-full h-auto max-w-3xl mx-auto"
          />
        </div>
      </div>

      {/* Right Side - Register Form */}
      <div className="w-full lg:w-1/2 flex items-start justify-start lg:pl-16 p-8 overflow-y-auto max-h-screen">
        <div className="w-full max-w-lg">
          {/* Logo/Header */}
          <div className="mb-8">
            <img
              src={payorbitLogo}
              alt="Payorbit Logo"
              className="w-32 h-32 mb-6 object-contain"
            />
            <h1 className="text-4xl font-bold text-gray-800 mb-3">
              Create Account
            </h1>
            <p className="text-gray-600 text-base">
              Fill in the details to get started
            </p>
          </div>

          {/* Register Form */}
          <Form
            name="register"
            onFinish={onFinish}
            size="large"
            className="space-y-5"
            layout="vertical"
          >
            <Form.Item
              name="username"
              rules={[
                { required: true, message: 'Please input your username!' },
                { min: 4, message: 'Username must be at least 4 characters!' }
              ]}
            >
              <Input
                prefix={<UserOutlined className="text-gray-400 text-lg" />}
                placeholder="Username"
                className="rounded-lg h-14 text-base"
              />
            </Form.Item>

            <Form.Item
              name="email"
              rules={[
                { required: true, message: 'Please input your email!' },
                { type: 'email', message: 'Please enter a valid email!' }
              ]}
            >
              <Input
                prefix={<MailOutlined className="text-gray-400 text-lg" />}
                placeholder="Email"
                className="rounded-lg h-14 text-base"
              />
            </Form.Item>

            <Form.Item
              name="organization_name"
              rules={[
                { required: true, message: 'Please input your organization name!' }
              ]}
            >
              <Input
                prefix={<BankOutlined className="text-gray-400 text-lg" />}
                placeholder="Organization Name"
                className="rounded-lg h-14 text-base"
              />
            </Form.Item>

            <div className="grid grid-cols-2 gap-4">
              <Form.Item
                name="first_name"
                rules={[
                  { required: true, message: 'Please input your first name!' }
                ]}
              >
                <Input
                  prefix={<IdcardOutlined className="text-gray-400 text-lg" />}
                  placeholder="First Name"
                  className="rounded-lg h-14 text-base"
                />
              </Form.Item>

              <Form.Item
                name="last_name"
                rules={[
                  { required: true, message: 'Please input your last name!' }
                ]}
              >
                <Input
                  prefix={<IdcardOutlined className="text-gray-400 text-lg" />}
                  placeholder="Last Name"
                  className="rounded-lg h-14 text-base"
                />
              </Form.Item>
            </div>

            <Form.Item
              name="password"
              rules={[
                { validator: validatePassword }
              ]}
            >
              <Input.Password
                prefix={<LockOutlined className="text-gray-400 text-lg" />}
                placeholder="Password"
                className="rounded-lg h-14 text-base"
              />
            </Form.Item>

            <Form.Item
              name="confirm_password"
              dependencies={['password']}
              rules={[
                { required: true, message: 'Please confirm your password!' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('Passwords do not match!'));
                  },
                }),
              ]}
            >
              <Input.Password
                prefix={<LockOutlined className="text-gray-400 text-lg" />}
                placeholder="Confirm Password"
                className="rounded-lg h-14 text-base"
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                className="w-full h-14 bg-blue-600 hover:bg-blue-700 rounded-lg text-lg font-semibold"
              >
                Create Account
              </Button>
            </Form.Item>
          </Form>

          {/* Login Link */}
          <div className="mt-8">
            <p className="text-gray-600 text-base">
              Already have an account?{' '}
              <a
                href="/login"
                className="text-blue-600 hover:text-blue-700 font-semibold"
              >
                Sign in
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
