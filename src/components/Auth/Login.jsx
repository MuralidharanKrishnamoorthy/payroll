import React, { useState } from 'react';
import { Form, Input, Button, Checkbox, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import authService from '../../services/auth.service';
import authIllustration from '../../assets/images/auth-illustration.png';
import payorbitLogo from '../../assets/images/payorbit.png';

const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      console.log('Submitting login with username:', values.username);
      console.log('API Base URL:', process.env.NODE_ENV === 'development' ? '/api' : 'https://app-a-p-p-adqaj.ondigitalocean.app/api');

      const response = await authService.login({
        username: values.username,
        password: values.password,
      });
      console.log('Login response:', response);

      if (response.success) {
        message.success(response.message || 'Login successful!');
        setTimeout(() => {
          navigate('/dashboard');
        }, 500);
      } else {
        message.error(response.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error details:', error);

      // Handle different error types
      let errorMessage = 'Login failed. Please try again.';

      if (error.response) {
        // Server responded with error
        console.log('Error response data:', error.response.data);
        errorMessage = error.response.data?.message ||
                      error.response.data?.errors?.non_field_errors?.[0] ||
                      'Invalid username or password';
      } else if (error.message) {
        // Network or other error
        errorMessage = error.message;
      }

      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
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

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-start lg:pl-16 p-8 overflow-hidden">
        <div className="w-full max-w-lg">
          {/* Logo/Header */}
          <div className="mb-10">
            <img
              src={payorbitLogo}
              alt="Payorbit Logo"
              className="w-32 h-32 mb-6 object-contain"
            />
            <h1 className="text-4xl font-bold text-gray-800 mb-3">
              Welcome Back!
            </h1>
            <p className="text-gray-600 text-base">
              Sign in to access your payroll dashboard
            </p>
          </div>

          {/* Login Form */}
          <Form
            name="login"
            initialValues={{ remember: true }}
            onFinish={onFinish}
            size="large"
            className="space-y-6"
          >
            <Form.Item
              name="username"
              rules={[
                { required: true, message: 'Please input your username!' }
              ]}
            >
              <Input
                prefix={<UserOutlined className="text-gray-400 text-lg" />}
                placeholder="Username"
                className="rounded-lg h-14 text-base"
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                { required: true, message: 'Please input your password!' }
              ]}
            >
              <Input.Password
                prefix={<LockOutlined className="text-gray-400 text-lg" />}
                placeholder="Password"
                className="rounded-lg h-14 text-base"
              />
            </Form.Item>

            <Form.Item>
              <div className="flex items-center justify-between">
                <Form.Item name="remember" valuePropName="checked" noStyle>
                  <Checkbox className="text-gray-600 text-base">
                    Remember me
                  </Checkbox>
                </Form.Item>
                <a
                  href="/forgot-password"
                  className="text-blue-600 hover:text-blue-700 text-base"
                >
                  Forgot password?
                </a>
              </div>
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                className="w-full h-14 bg-blue-600 hover:bg-blue-700 rounded-lg text-lg font-semibold"
              >
                Sign In
              </Button>
            </Form.Item>
          </Form>

          {/* Register Link */}
          <div className="mt-8">
            <p className="text-gray-600 text-base">
              Don't have an account?{' '}
              <a
                href="/register"
                className="text-blue-600 hover:text-blue-700 font-semibold"
              >
                Sign up now
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
