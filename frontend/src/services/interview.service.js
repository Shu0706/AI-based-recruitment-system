import axios from 'axios';
import { INTERVIEW_API, TIMESLOT_API } from '../config/constants';

/**
 * Service for interview-related API calls
 */
export const InterviewService = {
  /**
   * Get all interviews (admin view)
   * @param {Object} params - Query parameters for filtering
   * @returns {Promise} - Response from API
   */
  getAllInterviews: async (params = {}) => {
    try {
      const response = await axios.get(INTERVIEW_API.GET_ALL, { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error fetching interviews' };
    }
  },

  /**
   * Get interview by ID
   * @param {string} id - Interview ID
   * @returns {Promise} - Response from API
   */
  getInterviewById: async (id) => {
    try {
      const response = await axios.get(INTERVIEW_API.GET_BY_ID(id));
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error fetching interview' };
    }
  },

  /**
   * Schedule a new interview
   * @param {Object} interviewData - Interview data
   * @returns {Promise} - Response from API
   */
  scheduleInterview: async (interviewData) => {
    try {
      const response = await axios.post(INTERVIEW_API.SCHEDULE, interviewData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error scheduling interview' };
    }
  },

  /**
   * Update interview details
   * @param {string} id - Interview ID
   * @param {Object} interviewData - Updated interview data
   * @returns {Promise} - Response from API
   */
  updateInterview: async (id, interviewData) => {
    try {
      const response = await axios.put(INTERVIEW_API.UPDATE(id), interviewData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error updating interview' };
    }
  },

  /**
   * Cancel an interview
   * @param {string} id - Interview ID
   * @param {string} reason - Cancellation reason
   * @returns {Promise} - Response from API
   */
  cancelInterview: async (id, reason) => {
    try {
      const response = await axios.post(INTERVIEW_API.CANCEL(id), { reason });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error cancelling interview' };
    }
  },

  /**
   * Confirm an interview
   * @param {string} id - Interview ID
   * @returns {Promise} - Response from API
   */
  confirmInterview: async (id) => {
    try {
      const response = await axios.post(INTERVIEW_API.CONFIRM(id));
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error confirming interview' };
    }
  },

  /**
   * Get user's interviews
   * @returns {Promise} - Response from API
   */
  getUserInterviews: async () => {
    try {
      const response = await axios.get(INTERVIEW_API.USER_INTERVIEWS);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error fetching user interviews' };
    }
  },

  /**
   * Get admin's interviews
   * @returns {Promise} - Response from API
   */
  getAdminInterviews: async () => {
    try {
      const response = await axios.get(INTERVIEW_API.ADMIN_INTERVIEWS);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error fetching admin interviews' };
    }
  },

  /**
   * Get all time slots
   * @returns {Promise} - Response from API
   */
  getAllTimeSlots: async () => {
    try {
      const response = await axios.get(TIMESLOT_API.GET_ALL);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error fetching time slots' };
    }
  },

  /**
   * Create a new time slot
   * @param {Object} timeSlotData - Time slot data
   * @returns {Promise} - Response from API
   */
  createTimeSlot: async (timeSlotData) => {
    try {
      const response = await axios.post(TIMESLOT_API.CREATE, timeSlotData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error creating time slot' };
    }
  },

  /**
   * Update a time slot
   * @param {string} id - Time slot ID
   * @param {Object} timeSlotData - Updated time slot data
   * @returns {Promise} - Response from API
   */
  updateTimeSlot: async (id, timeSlotData) => {
    try {
      const response = await axios.put(TIMESLOT_API.UPDATE(id), timeSlotData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error updating time slot' };
    }
  },

  /**
   * Delete a time slot
   * @param {string} id - Time slot ID
   * @returns {Promise} - Response from API
   */
  deleteTimeSlot: async (id) => {
    try {
      const response = await axios.delete(TIMESLOT_API.DELETE(id));
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error deleting time slot' };
    }
  },

  /**
   * Get available time slots
   * @returns {Promise} - Response from API
   */
  getAvailableTimeSlots: async () => {
    try {
      const response = await axios.get(TIMESLOT_API.AVAILABLE);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error fetching available time slots' };
    }
  },
};
