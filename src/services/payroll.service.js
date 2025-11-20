import api from './api';

const payrollService = {
  
  getUploadedFiles: async () => {
    try {
      console.log('Fetching uploaded files...');
      const response = await api.get('/uploads/');
      console.log('Uploaded files response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching uploaded files:', error);
      throw error.response?.data || error;
    }
  },

  
  getUploadById: async (uploadId) => {
    try {
      console.log('Fetching upload details for ID:', uploadId);
      const response = await api.get(`/uploads/${uploadId}/`);
      console.log('Upload details response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching upload details:', error);
      throw error.response?.data || error;
    }
  },

  
  getEmployeesByUploadId: async (uploadId) => {
    try {
      console.log('Fetching employees for upload ID:', uploadId);
      const response = await api.get(`/uploads/${uploadId}/employees/`);
      console.log('Employees response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching employees:', error);
      throw error.response?.data || error;
    }
  },
};

export default payrollService;
