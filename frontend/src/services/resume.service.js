import axios from 'axios';
import { RESUME_API } from '../config/constants';

/**
 * Service for resume-related API calls
 */
export const ResumeService = {
  /**
   * Upload a new resume
   * @param {File} file - Resume file
   * @returns {Promise} - Response from API
   */
  uploadResume: async (file) => {
    try {
      const formData = new FormData();
      formData.append('resume', file);

      const response = await axios.post(RESUME_API.UPLOAD, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error uploading resume' };
    }
  },

  /**
   * Get all user's resumes
   * @returns {Promise} - Response from API
   */
  getAllResumes: async () => {
    try {
      const response = await axios.get(RESUME_API.GET_ALL);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error fetching resumes' };
    }
  },

  /**
   * Get resume by ID
   * @param {string} id - Resume ID
   * @returns {Promise} - Response from API
   */
  getResumeById: async (id) => {
    try {
      const response = await axios.get(RESUME_API.GET_BY_ID(id));
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error fetching resume' };
    }
  },

  /**
   * Update resume status (activate/deactivate)
   * @param {string} id - Resume ID
   * @param {boolean} isActive - Active status
   * @returns {Promise} - Response from API
   */
  updateResumeStatus: async (id, isActive) => {
    try {
      const response = await axios.patch(RESUME_API.UPDATE_STATUS(id), { isActive });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error updating resume status' };
    }
  },

  /**
   * Download resume file
   * @param {string} id - Resume ID
   * @returns {Promise} - Blob response from API
   */
  downloadResume: async (id) => {
    try {
      const response = await axios.get(RESUME_API.DOWNLOAD(id), {
        responseType: 'blob',
      });
      
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error downloading resume' };
    }
  },
};
