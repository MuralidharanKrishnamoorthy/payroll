import axios from 'axios';

const uploadExcelFile = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  const token = localStorage.getItem('token');

  console.log('Starting file upload...');
  console.log('File:', file.name);
  console.log('Token:', token ? token.substring(0, 10) + '...' : 'No token found!');

  if (!token) {
    throw new Error('No authentication token found. Please login first.');
  }

  try {
    const response = await axios.post(
      'https://app-a-p-p-adqaj.ondigitalocean.app/api/uploads/',
      formData,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
        transformRequest: [(data, headers) => {
          // Return FormData as-is without transformation
          return data;
        }],
      }
    );

    console.log('Upload successful!', response.data);
    return response.data;
  } catch (error) {
    console.error('Upload error:', error);
    console.error('Error response:', error.response?.data);
    console.error('Error status:', error.response?.status);
    console.error('Request headers sent:', error.config?.headers);

    throw error.response?.data || error.message;
  }
};

export default uploadExcelFile;
