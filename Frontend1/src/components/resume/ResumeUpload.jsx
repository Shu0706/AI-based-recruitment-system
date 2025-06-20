import React, { useState, useContext, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { uploadResume } from '../../services/resume.service';
import Button from '../ui/Button';
import Card from '../ui/Card';
import Loading from '../ui/Loading';

const ResumeUpload = () => {
  const { user, updateUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(location.state?.message || null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const redirectAfterUpload = location.state?.redirectAfterUpload || '/profile';

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    validateAndSetFile(selectedFile);
  };

  const validateAndSetFile = (selectedFile) => {
    if (!selectedFile) return;
    
    // Check file type - accept PDF, DOCX, DOC
    const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword'];
    if (!validTypes.includes(selectedFile.type)) {
      setError('Please upload a PDF or Word document (.pdf, .docx, .doc)');
      return;
    }
    
    // Check file size (max 5MB)
    if (selectedFile.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB');
      return;
    }
    
    setFile(selectedFile);
    setError(null);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!file) {
      setError('Please select a resume file to upload');
      return;
    }
    
    try {
      setLoading(true);
      
      const formData = new FormData();
      formData.append('resume', file);
      formData.append('userId', user.id);
      
      const response = await uploadResume(formData);
      
      // Update user context to indicate they have a resume
      updateUser({ ...user, hasResume: true, resumeId: response.id });
      
      setMessage('Resume uploaded successfully!');
      
      // Redirect after upload if specified
      setTimeout(() => {
        navigate(redirectAfterUpload);
      }, 1500);
      
    } catch (err) {
      console.error('Error uploading resume:', err);
      setError('Failed to upload resume. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <Card className="p-6">
        <h1 className="text-2xl font-bold mb-6">Upload Your Resume</h1>
        
        {message && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-6">
            <span className="block sm:inline">{message}</span>
          </div>
        )}
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6">
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div 
            className={`border-2 border-dashed rounded-lg p-10 text-center mb-6 ${
              dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
            }`}
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
          >
            <input
              type="file"
              id="resume"
              ref={fileInputRef}
              className="hidden"
              accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              onChange={handleFileChange}
            />
            
            <div className="flex flex-col items-center justify-center">
              <svg 
                className="w-12 h-12 text-gray-400 mb-3" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" 
                />
              </svg>
              
              <p className="mb-2 text-sm text-gray-500">
                <span className="font-semibold">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-gray-500">
                PDF or Word (MAX. 5MB)
              </p>
              
              <Button 
                type="button"
                variant="outline"
                className="mt-4"
                onClick={() => fileInputRef.current.click()}
              >
                Select File
              </Button>
            </div>
          </div>
          
          {file && (
            <div className="mb-6 p-4 bg-gray-50 rounded-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <svg 
                    className="w-8 h-8 text-gray-500 mr-3" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24" 
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
                    />
                  </svg>
                  <div>
                    <p className="font-medium">{file.name}</p>
                    <p className="text-sm text-gray-500">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  className="text-red-500 hover:text-red-700"
                  onClick={() => setFile(null)}
                >
                  <svg 
                    className="w-5 h-5" 
                    fill="currentColor" 
                    viewBox="0 0 20 20" 
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path 
                      fillRule="evenodd" 
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" 
                      clipRule="evenodd" 
                    />
                  </svg>
                </button>
              </div>
            </div>
          )}
          
          <div className="flex justify-between">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => navigate(-1)}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={!file || loading}
              loading={loading}
            >
              {loading ? 'Uploading...' : 'Upload Resume'}
            </Button>
          </div>
        </form>
      </Card>
      
      <div className="mt-6">
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Resume Tips</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>Keep your resume concise and focused on relevant experience</li>
            <li>Use bullet points to highlight key achievements</li>
            <li>Include relevant skills and technologies</li>
            <li>Tailor your resume for each job application</li>
            <li>Proofread for grammar and spelling errors</li>
            <li>Use a clean, professional layout</li>
          </ul>
        </Card>
      </div>
    </div>
  );
};

export default ResumeUpload;
