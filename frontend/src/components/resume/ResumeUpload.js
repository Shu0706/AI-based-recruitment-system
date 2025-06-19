import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { toast } from 'react-toastify';
import { DocumentArrowUpIcon, DocumentCheckIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { ResumeService } from '../../services/resume.service';

const ResumeUpload = ({ onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Handle file drop
  const onDrop = useCallback((acceptedFiles) => {
    // Accept only one file
    if (acceptedFiles.length > 0) {
      const selectedFile = acceptedFiles[0];
      
      // Check file type
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/plain',
      ];
      
      if (!allowedTypes.includes(selectedFile.type)) {
        toast.error('Invalid file type. Please upload PDF, DOC, DOCX, or TXT files.');
        return;
      }
      
      // Check file size (5MB max)
      if (selectedFile.size > 5 * 1024 * 1024) {
        toast.error('File too large. Maximum size is 5MB.');
        return;
      }
      
      setFile(selectedFile);
    }
  }, []);

  // Configure dropzone
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt'],
    },
    maxFiles: 1,
  });

  // Handle file upload
  const handleUpload = async () => {
    if (!file) {
      toast.error('Please select a file to upload');
      return;
    }
    
    try {
      setIsUploading(true);
      
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 300);
      
      // Upload file
      const response = await ResumeService.uploadResume(file);
      
      // Clear progress interval
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      // Notify success
      toast.success('Resume uploaded and processed successfully');
      
      // Call success callback if provided
      if (onUploadSuccess) {
        onUploadSuccess(response.resume);
      }
      
      // Reset state after success
      setTimeout(() => {
        setFile(null);
        setUploadProgress(0);
      }, 1000);
      
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(error.message || 'Error uploading resume');
    } finally {
      setIsUploading(false);
    }
  };

  // Handle file removal
  const handleRemoveFile = () => {
    setFile(null);
    setUploadProgress(0);
  };

  return (
    <div className="space-y-4">
      <div 
        {...getRootProps()} 
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
          isDragActive 
            ? 'border-primary-500 bg-primary-50' 
            : 'border-gray-300 hover:border-primary-400'
        }`}
      >
        <input {...getInputProps()} />
        
        <div className="space-y-2">
          <DocumentArrowUpIcon className="mx-auto h-12 w-12 text-gray-400" />
          
          <h3 className="text-lg font-medium text-gray-900">
            {isDragActive ? 'Drop your resume here' : 'Upload your resume'}
          </h3>
          
          <p className="text-sm text-gray-500">
            Drag and drop your resume file here, or click to select a file
          </p>
          
          <p className="text-xs text-gray-500">
            Supported formats: PDF, DOC, DOCX, TXT (Max size: 5MB)
          </p>
        </div>
      </div>

      {file && (
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <DocumentCheckIcon className="h-8 w-8 text-primary-500" />
              
              <div>
                <p className="font-medium text-gray-900">{file.name}</p>
                <p className="text-sm text-gray-500">
                  {(file.size / 1024).toFixed(2)} KB • {file.type}
                </p>
              </div>
            </div>
            
            {!isUploading && (
              <button
                type="button"
                onClick={handleRemoveFile}
                className="text-gray-400 hover:text-gray-500"
              >
                <XCircleIcon className="h-5 w-5" />
              </button>
            )}
          </div>

          {uploadProgress > 0 && (
            <div className="mt-3">
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary-500 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <p className="mt-1 text-xs text-gray-500 text-right">
                {uploadProgress === 100 ? 'Complete!' : `${uploadProgress}%`}
              </p>
            </div>
          )}
        </div>
      )}

      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleUpload}
          disabled={!file || isUploading}
          className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isUploading ? 'Uploading...' : 'Upload Resume'}
        </button>
      </div>
    </div>
  );
};

export default ResumeUpload;
