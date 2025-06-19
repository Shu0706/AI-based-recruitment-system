import axios from 'axios';
import { JOB_API } from '../config/constants';

/**
 * Service for job-related API calls
 */
export const JobService = {
  /**
   * Get all jobs with optional filters
   * @param {Object} params - Query parameters for filtering
   * @returns {Promise} - Response from API
   */
  getAllJobs: async (params = {}) => {
    try {
      const response = await axios.get(JOB_API.GET_ALL, { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error fetching jobs' };
    }
  },

  /**
   * Get job by ID
   * @param {string} id - Job ID
   * @returns {Promise} - Response from API
   */
  getJobById: async (id) => {
    try {
      const response = await axios.get(JOB_API.GET_BY_ID(id));
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error fetching job' };
    }
  },

  /**
   * Create a new job
   * @param {Object} jobData - Job data
   * @returns {Promise} - Response from API
   */
  createJob: async (jobData) => {
    try {
      const response = await axios.post(JOB_API.CREATE, jobData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error creating job' };
    }
  },

  /**
   * Update an existing job
   * @param {string} id - Job ID
   * @param {Object} jobData - Updated job data
   * @returns {Promise} - Response from API
   */
  updateJob: async (id, jobData) => {
    try {
      const response = await axios.put(JOB_API.UPDATE(id), jobData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error updating job' };
    }
  },

  /**
   * Delete a job
   * @param {string} id - Job ID
   * @returns {Promise} - Response from API
   */
  deleteJob: async (id) => {
    try {
      const response = await axios.delete(JOB_API.DELETE(id));
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error deleting job' };
    }
  },

  /**
   * Get all jobs created by current admin
   * @param {Object} params - Query parameters for pagination
   * @returns {Promise} - Response from API
   */
  getAdminJobs: async (params = {}) => {
    try {
      const response = await axios.get(JOB_API.ADMIN_JOBS, { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error fetching admin jobs' };
    }
  },

  /**
   * Get matching candidates for a job
   * @param {string} jobId - Job ID
   * @returns {Promise} - Response from API
   */
  getMatchingCandidates: async (jobId) => {
    try {
      const response = await axios.get(JOB_API.MATCHING_CANDIDATES(jobId));
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error fetching matching candidates' };
    }
  },
};
