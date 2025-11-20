import React, { useState } from 'react';
import uploadExcelFile from '../../services/upload.service';

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [warnings, setWarnings] = useState([]);
  const [errors, setErrors] = useState([]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];

    // Validate file type
    if (selectedFile && !selectedFile.name.endsWith('.xlsx')) {
      setMessage({ type: 'error', text: 'Only .xlsx files are allowed' });
      setFile(null);
      return;
    }

    setFile(selectedFile);
    setMessage(null);
    setErrors([]);
    setWarnings([]);
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage({ type: 'error', text: 'Please select a file first' });
      return;
    }

    console.log('Starting file upload...', {
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type
    });

    setLoading(true);
    setMessage(null);
    setErrors([]);
    setWarnings([]);

    try {
      const response = await uploadExcelFile(file);

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

        setMessage({
          type: 'success',
          text: response.message || `File processed successfully. ${response.data.total_employees} employees loaded.`
        });

        // Show warnings if any
        if (response.warnings && response.warnings.length > 0) {
          console.warn('Upload Warnings:', response.warnings);
          setWarnings(response.warnings);
        }

        // Clear file input after successful upload
        setFile(null);
        document.getElementById('file-input').value = '';
      }
    } catch (error) {
      console.error('Upload error:', error);
      console.error('Error details:', {
        message: error.message,
        errors: error.errors,
        fullError: error
      });

      if (error.errors && Array.isArray(error.errors)) {
        setErrors(error.errors);
        setMessage({ type: 'error', text: error.message || 'File validation failed' });
      } else if (error.message) {
        setMessage({ type: 'error', text: error.message });
      } else {
        setMessage({ type: 'error', text: 'Failed to upload file. Please try again.' });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="file-upload-container">
      <h2>Upload Payroll Excel File</h2>

      <div className="upload-section">
        <input
          id="file-input"
          type="file"
          accept=".xlsx"
          onChange={handleFileChange}
          disabled={loading}
        />

        <button
          onClick={handleUpload}
          disabled={!file || loading}
        >
          {loading ? 'Uploading...' : 'Upload'}
        </button>
      </div>

      {message && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}

      {errors.length > 0 && (
        <div className="errors">
          <h4>Errors:</h4>
          <ul>
            {errors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      {warnings.length > 0 && (
        <div className="warnings">
          <h4>Warnings:</h4>
          <ul>
            {warnings.map((warning, index) => (
              <li key={index}>{warning}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="file-format-info">
        <h4>Required Excel Format:</h4>
        <p>The Excel file must contain the following columns:</p>
        <ul>
          <li>Employee ID</li>
          <li>Employee Name</li>
          <li>Email</li>
          <li>Department</li>
          <li>Position</li>
          <li>Salary</li>
        </ul>
      </div>
    </div>
  );
};

export default FileUpload;
