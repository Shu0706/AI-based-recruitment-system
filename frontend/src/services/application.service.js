import axios from 'axios';
import { APPLICATION_API } from '../config/constants';

/**
 * Service for application-related API calls
 */
export const ApplicationService = {
  /**
   * Apply for a job
   * @param {Object} applicationData - Application data
   * @returns {Promise} - Response from API
   */
  applyForJob: async (applicationData) => {
    try {
      const response = await axios.post(APPLICATION_API.APPLY, applicationData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error applying for job' };
    }
  },

  /**
   * Get all applications (admin view)
   * @param {Object} params - Query parameters for filtering
   * @returns {Promise} - Response from API
   */
  getAllApplications: async (params = {}) => {
    try {
      const response = await axios.get(APPLICATION_API.GET_ALL, { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error fetching applications' };
    }
  },

  /**
   * Get application by ID
   * @param {string} id - Application ID
   * @returns {Promise} - Response from API
   */
  getApplicationById: async (id) => {
    try {
      const response = await axios.get(APPLICATION_API.GET_BY_ID(id));
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error fetching application' };
    }
  },

  /**
   * Update application status
   * @param {string} id - Application ID
   * @param {string} status - New status
   * @param {string} notes - Optional notes
   * @returns {Promise} - Response from API
   */
  updateApplicationStatus: async (id, status, notes = '') => {
    try {
      const response = await axios.patch(APPLICATION_API.UPDATE_STATUS(id), { status, notes });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error updating application status' };
    }
  },

  /**
   * Get user's applications
   * @returns {Promise} - Response from API
   */
  getUserApplications: async () => {
    try {
      const response = await axios.get(APPLICATION_API.USER_APPLICATIONS);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error fetching user applications' };
    }
  },
};
