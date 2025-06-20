import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import TextArea from '../../components/ui/TextArea';
import Loading from '../../components/ui/Loading';
import JobService from '../../services/job.service';

// Job validation schema (same as in CreateJob)
const jobValidationSchema = Yup.object().shape({
  title: Yup.string().required('Job title is required'),
  department: Yup.string().required('Department is required'),
  location: Yup.string().required('Location is required'),
  type: Yup.string().required('Job type is required'),
  experience: Yup.string().required('Experience level is required'),
  salary: Yup.object().shape({
    min: Yup.number().required('Minimum salary is required'),
    max: Yup.number()
      .required('Maximum salary is required')
      .moreThan(Yup.ref('min'), 'Maximum salary must be greater than minimum'),
    currency: Yup.string().required('Currency is required'),
    period: Yup.string().required('Salary period is required'),
  }),
  description: Yup.string().required('Job description is required'),
  requirements: Yup.string().required('Job requirements are required'),
  responsibilities: Yup.string().required('Job responsibilities are required'),
  skills: Yup.array()
    .of(Yup.string())
    .min(1, 'At least one skill is required'),
  applicationDeadline: Yup.date()
    .required('Application deadline is required'),
  status: Yup.string().required('Status is required'),
});

// Job type options
const jobTypeOptions = [
  { value: 'full-time', label: 'Full-time' },
  { value: 'part-time', label: 'Part-time' },
  { value: 'contract', label: 'Contract' },
  { value: 'internship', label: 'Internship' },
  { value: 'remote', label: 'Remote' },
];

// Experience level options
const experienceOptions = [
  { value: 'entry', label: 'Entry Level (0-2 years)' },
  { value: 'mid', label: 'Mid Level (3-5 years)' },
  { value: 'senior', label: 'Senior Level (5+ years)' },
  { value: 'executive', label: 'Executive Level' },
];

// Currency options
const currencyOptions = [
  { value: 'USD', label: 'USD ($)' },
  { value: 'EUR', label: 'EUR (€)' },
  { value: 'GBP', label: 'GBP (£)' },
  { value: 'INR', label: 'INR (₹)' },
  { value: 'CAD', label: 'CAD (C$)' },
  { value: 'AUD', label: 'AUD (A$)' },
  { value: 'JPY', label: 'JPY (¥)' },
];

// Salary period options
const salaryPeriodOptions = [
  { value: 'hourly', label: 'Per Hour' },
  { value: 'monthly', label: 'Per Month' },
  { value: 'yearly', label: 'Per Year' },
];

// Job status options
const jobStatusOptions = [
  { value: 'draft', label: 'Draft' },
  { value: 'active', label: 'Active' },
  { value: 'closed', label: 'Closed' },
  { value: 'expired', label: 'Expired' },
];

const EditJob = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Fetch job details on component mount
  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        setLoading(true);
        const response = await JobService.getJobById(id);
        
        // Format deadline date for the form (YYYY-MM-DD)
        if (response.data?.applicationDeadline) {
          const date = new Date(response.data.applicationDeadline);
          response.data.applicationDeadline = date.toISOString().split('T')[0];
        }
        
        setJob(response.data);
      } catch (err) {
        console.error('Error fetching job details:', err);
        setError(err.response?.data?.message || 'Failed to fetch job details');
        toast.error('Failed to fetch job details. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchJobDetails();
  }, [id]);
  
  // Function to handle form submission
  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      // Format skills array if it's a string input
      if (typeof values.skills === 'string') {
        values.skills = values.skills
          .split(',')
          .map(skill => skill.trim())
          .filter(skill => skill);
      }
      
      await JobService.updateJob(id, values);
      toast.success('Job updated successfully!');
      navigate('/admin/jobs');
    } catch (error) {
      console.error('Error updating job:', error);
      toast.error(error.response?.data?.message || 'Failed to update job. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };
  
  if (loading) return <Loading center size="lg" />;
  
  if (error || !job) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-500 mb-4">{error || 'Failed to load job details'}</p>
        <Button onClick={() => navigate('/admin/jobs')}>Back to Jobs</Button>
      </div>
    );
  }
  
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Edit Job</h1>
        <Button variant="outline" onClick={() => navigate('/admin/jobs')}>
          Cancel
        </Button>
      </div>
      
      <Formik
        initialValues={job}
        validationSchema={jobValidationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ isSubmitting, values, setFieldValue, errors, touched }) => (
          <Form>
            <div className="grid grid-cols-1 gap-6">
              {/* Basic Information */}
              <Card title="Basic Information">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field name="title">
                    {({ field }) => (
                      <Input
                        label="Job Title"
                        placeholder="e.g. Senior Software Engineer"
                        required
                        {...field}
                        error={errors.title}
                        touched={touched.title}
                      />
                    )}
                  </Field>
                  
                  <Field name="department">
                    {({ field }) => (
                      <Input
                        label="Department"
                        placeholder="e.g. Engineering"
                        required
                        {...field}
                        error={errors.department}
                        touched={touched.department}
                      />
                    )}
                  </Field>
                  
                  <Field name="location">
                    {({ field }) => (
                      <Input
                        label="Location"
                        placeholder="e.g. New York, NY or Remote"
                        required
                        {...field}
                        error={errors.location}
                        touched={touched.location}
                      />
                    )}
                  </Field>
                  
                  <Field name="type">
                    {({ field }) => (
                      <Select
                        label="Job Type"
                        options={jobTypeOptions}
                        required
                        {...field}
                        error={errors.type}
                        touched={touched.type}
                      />
                    )}
                  </Field>
                  
                  <Field name="experience">
                    {({ field }) => (
                      <Select
                        label="Experience Level"
                        options={experienceOptions}
                        required
                        {...field}
                        error={errors.experience}
                        touched={touched.experience}
                      />
                    )}
                  </Field>
                  
                  <Field name="applicationDeadline">
                    {({ field }) => (
                      <Input
                        label="Application Deadline"
                        type="date"
                        required
                        {...field}
                        error={errors.applicationDeadline}
                        touched={touched.applicationDeadline}
                      />
                    )}
                  </Field>
                </div>
              </Card>
              
              {/* Salary Information */}
              <Card title="Salary Information">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field name="salary.min">
                    {({ field }) => (
                      <Input
                        label="Minimum Salary"
                        type="number"
                        placeholder="e.g. 50000"
                        required
                        {...field}
                        error={errors.salary?.min}
                        touched={touched.salary?.min}
                      />
                    )}
                  </Field>
                  
                  <Field name="salary.max">
                    {({ field }) => (
                      <Input
                        label="Maximum Salary"
                        type="number"
                        placeholder="e.g. 80000"
                        required
                        {...field}
                        error={errors.salary?.max}
                        touched={touched.salary?.max}
                      />
                    )}
                  </Field>
                  
                  <Field name="salary.currency">
                    {({ field }) => (
                      <Select
                        label="Currency"
                        options={currencyOptions}
                        required
                        {...field}
                        error={errors.salary?.currency}
                        touched={touched.salary?.currency}
                      />
                    )}
                  </Field>
                  
                  <Field name="salary.period">
                    {({ field }) => (
                      <Select
                        label="Salary Period"
                        options={salaryPeriodOptions}
                        required
                        {...field}
                        error={errors.salary?.period}
                        touched={touched.salary?.period}
                      />
                    )}
                  </Field>
                </div>
              </Card>
              
              {/* Job Details */}
              <Card title="Job Details">
                <Field name="description">
                  {({ field }) => (
                    <TextArea
                      label="Job Description"
                      placeholder="Provide a detailed description of the job..."
                      rows={6}
                      required
                      {...field}
                      error={errors.description}
                      touched={touched.description}
                    />
                  )}
                </Field>
                
                <Field name="requirements">
                  {({ field }) => (
                    <TextArea
                      label="Requirements"
                      placeholder="List the job requirements..."
                      rows={6}
                      required
                      {...field}
                      error={errors.requirements}
                      touched={touched.requirements}
                    />
                  )}
                </Field>
                
                <Field name="responsibilities">
                  {({ field }) => (
                    <TextArea
                      label="Responsibilities"
                      placeholder="List the key responsibilities..."
                      rows={6}
                      required
                      {...field}
                      error={errors.responsibilities}
                      touched={touched.responsibilities}
                    />
                  )}
                </Field>
                
                <Field name="skills">
                  {({ field }) => (
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Skills Required <span className="text-red-500">*</span>
                      </label>
                      
                      <div className="flex flex-wrap gap-2 mb-2">
                        {(Array.isArray(values.skills) ? values.skills : []).map((skill, index) => (
                          <div 
                            key={index} 
                            className="bg-blue-100 text-blue-800 text-sm py-1 px-3 rounded-full flex items-center"
                          >
                            {skill}
                            <button
                              type="button"
                              className="ml-2 text-blue-600 hover:text-blue-800"
                              onClick={() => {
                                const newSkills = [...values.skills];
                                newSkills.splice(index, 1);
                                setFieldValue('skills', newSkills);
                              }}
                            >
                              &times;
                            </button>
                          </div>
                        ))}
                      </div>
                      
                      <div className="flex">
                        <input
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          placeholder="Add skills (e.g. JavaScript, React, Node.js)"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ',') {
                              e.preventDefault();
                              
                              const skillValue = e.target.value.trim();
                              if (skillValue) {
                                const currentSkills = Array.isArray(values.skills) ? values.skills : [];
                                if (!currentSkills.includes(skillValue)) {
                                  setFieldValue('skills', [...currentSkills, skillValue]);
                                }
                                e.target.value = '';
                              }
                            }
                          }}
                        />
                        <Button
                          type="button"
                          className="ml-2"
                          onClick={(e) => {
                            const input = e.target.previousSibling;
                            const skillValue = input.value.trim();
                            
                            if (skillValue) {
                              const currentSkills = Array.isArray(values.skills) ? values.skills : [];
                              if (!currentSkills.includes(skillValue)) {
                                setFieldValue('skills', [...currentSkills, skillValue]);
                              }
                              input.value = '';
                            }
                          }}
                        >
                          Add
                        </Button>
                      </div>
                      
                      {errors.skills && touched.skills && (
                        <p className="mt-1 text-sm text-red-600">{errors.skills}</p>
                      )}
                      
                      <p className="mt-1 text-sm text-gray-500">
                        Press Enter or comma after each skill to add it to the list
                      </p>
                    </div>
                  )}
                </Field>
              </Card>
              
              {/* Job Status */}
              <Card title="Job Status">
                <Field name="status">
                  {({ field }) => (
                    <Select
                      label="Status"
                      options={jobStatusOptions}
                      required
                      {...field}
                      error={errors.status}
                      touched={touched.status}
                    />
                  )}
                </Field>
                
                <p className="mt-2 text-sm text-gray-500">
                  <strong>Draft:</strong> Save the job but don't publish it yet. <br />
                  <strong>Active:</strong> Publish the job and make it visible to candidates. <br />
                  <strong>Closed:</strong> Close the job posting to new applications. <br />
                  <strong>Expired:</strong> Job posting that has passed its deadline.
                </p>
              </Card>
              
              {/* Application Statistics (read-only) */}
              {job.applicationCount !== undefined && (
                <Card title="Application Statistics">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-4 bg-gray-50 rounded-lg text-center">
                      <p className="text-gray-500 text-sm">Total Applications</p>
                      <p className="text-2xl font-bold">{job.applicationCount || 0}</p>
                    </div>
                    
                    {job.applicationStats && (
                      <>
                        <div className="p-4 bg-gray-50 rounded-lg text-center">
                          <p className="text-gray-500 text-sm">Shortlisted</p>
                          <p className="text-2xl font-bold">{job.applicationStats.shortlisted || 0}</p>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-lg text-center">
                          <p className="text-gray-500 text-sm">Interviewed</p>
                          <p className="text-2xl font-bold">{job.applicationStats.interviewed || 0}</p>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-lg text-center">
                          <p className="text-gray-500 text-sm">Hired</p>
                          <p className="text-2xl font-bold">{job.applicationStats.hired || 0}</p>
                        </div>
                      </>
                    )}
                  </div>
                </Card>
              )}
              
              {/* Form Actions */}
              <div className="flex justify-end space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/admin/jobs')}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  disabled={isSubmitting}
                  isLoading={isSubmitting}
                >
                  Update Job
                </Button>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default EditJob;
