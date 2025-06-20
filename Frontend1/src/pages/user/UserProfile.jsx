import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { updateUserProfile, getUserProfile } from '../../services/auth.service';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import TextArea from '../../components/ui/TextArea';
import Select from '../../components/ui/Select';
import Loading from '../../components/ui/Loading';

const UserProfile = () => {
  const { user, updateUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    location: '',
    title: '',
    bio: '',
    skills: [],
    experience: [],
    education: [],
    linkedin: '',
    github: '',
    portfolio: '',
    notifications: {
      jobAlerts: true,
      applicationUpdates: true,
      interviewReminders: true,
      marketingEmails: false
    }
  });

  // Skill input
  const [newSkill, setNewSkill] = useState('');
  
  // Experience input
  const [newExperience, setNewExperience] = useState({
    title: '',
    company: '',
    location: '',
    startDate: '',
    endDate: '',
    current: false,
    description: ''
  });

  // Education input
  const [newEducation, setNewEducation] = useState({
    degree: '',
    school: '',
    fieldOfStudy: '',
    startDate: '',
    endDate: '',
    current: false,
    description: ''
  });

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        if (!user) return;
        
        const userProfileData = await getUserProfile(user.id);
        setProfile(userProfileData);
      } catch (err) {
        console.error('Error fetching user profile:', err);
        setError('Failed to load user profile. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNotificationChange = (e) => {
    const { name, checked } = e.target;
    setProfile(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [name]: checked
      }
    }));
  };

  const handleAddSkill = () => {
    if (newSkill.trim() === '') return;
    
    setProfile(prev => ({
      ...prev,
      skills: [...prev.skills, newSkill.trim()]
    }));
    
    setNewSkill('');
  };

  const handleRemoveSkill = (skillToRemove) => {
    setProfile(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const handleExperienceChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewExperience(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleAddExperience = () => {
    if (!newExperience.title || !newExperience.company) return;
    
    setProfile(prev => ({
      ...prev,
      experience: [...prev.experience, { ...newExperience, id: Date.now() }]
    }));
    
    setNewExperience({
      title: '',
      company: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      description: ''
    });
  };

  const handleRemoveExperience = (id) => {
    setProfile(prev => ({
      ...prev,
      experience: prev.experience.filter(exp => exp.id !== id)
    }));
  };

  const handleEducationChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewEducation(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleAddEducation = () => {
    if (!newEducation.degree || !newEducation.school) return;
    
    setProfile(prev => ({
      ...prev,
      education: [...prev.education, { ...newEducation, id: Date.now() }]
    }));
    
    setNewEducation({
      degree: '',
      school: '',
      fieldOfStudy: '',
      startDate: '',
      endDate: '',
      current: false,
      description: ''
    });
  };

  const handleRemoveEducation = (id) => {
    setProfile(prev => ({
      ...prev,
      education: prev.education.filter(edu => edu.id !== id)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      
      await updateUserProfile(user.id, profile);
      
      // Update user in context with new name
      updateUser({
        ...user,
        firstName: profile.firstName,
        lastName: profile.lastName
      });
      
      setMessage('Profile updated successfully!');
      
      // Clear message after 3 seconds
      setTimeout(() => {
        setMessage(null);
      }, 3000);
      
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Failed to update profile. Please try again later.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">My Profile</h1>
      
      {message && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-6">
          <span className="block sm:inline">{message}</span>
          <span className="absolute top-0 bottom-0 right-0 px-4 py-3" onClick={() => setMessage(null)}>
            <svg className="fill-current h-6 w-6 text-green-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <title>Close</title>
              <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/>
            </svg>
          </span>
        </div>
      )}
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6">
          <span className="block sm:inline">{error}</span>
          <span className="absolute top-0 bottom-0 right-0 px-4 py-3" onClick={() => setError(null)}>
            <svg className="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <title>Close</title>
              <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/>
            </svg>
          </span>
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <Card className="p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <Input
              label="First Name"
              name="firstName"
              value={profile.firstName}
              onChange={handleInputChange}
              required
            />
            
            <Input
              label="Last Name"
              name="lastName"
              value={profile.lastName}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <Input
              label="Email"
              type="email"
              name="email"
              value={profile.email}
              onChange={handleInputChange}
              required
              disabled
            />
            
            <Input
              label="Phone"
              name="phone"
              value={profile.phone}
              onChange={handleInputChange}
              placeholder="e.g., +1 (555) 123-4567"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <Input
              label="Location"
              name="location"
              value={profile.location}
              onChange={handleInputChange}
              placeholder="e.g., New York, NY"
            />
            
            <Input
              label="Job Title"
              name="title"
              value={profile.title}
              onChange={handleInputChange}
              placeholder="e.g., Software Engineer"
            />
          </div>
          
          <TextArea
            label="Bio"
            name="bio"
            value={profile.bio}
            onChange={handleInputChange}
            placeholder="Tell us about yourself..."
            rows={4}
          />
        </Card>
        
        <Card className="p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Skills</h2>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {profile.skills.map((skill, index) => (
              <div 
                key={index} 
                className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full flex items-center"
              >
                <span>{skill}</span>
                <button 
                  type="button" 
                  className="ml-2 text-blue-600 hover:text-blue-800" 
                  onClick={() => handleRemoveSkill(skill)}
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
          
          <div className="flex items-center">
            <Input
              name="newSkill"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              placeholder="Add a skill..."
              className="mr-2"
            />
            <Button 
              type="button" 
              onClick={handleAddSkill}
              disabled={!newSkill.trim()}
            >
              Add
            </Button>
          </div>
        </Card>
        
        <Card className="p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Experience</h2>
          
          {profile.experience.map((exp) => (
            <div key={exp.id} className="mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex justify-between">
                <h3 className="font-semibold">{exp.title}</h3>
                <button 
                  type="button" 
                  className="text-red-600 hover:text-red-800" 
                  onClick={() => handleRemoveExperience(exp.id)}
                >
                  Remove
                </button>
              </div>
              <p className="text-gray-700">{exp.company}{exp.location ? `, ${exp.location}` : ''}</p>
              <p className="text-gray-600 text-sm">
                {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
              </p>
              <p className="mt-2">{exp.description}</p>
            </div>
          ))}
          
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold mb-3">Add Experience</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <Input
                label="Job Title"
                name="title"
                value={newExperience.title}
                onChange={handleExperienceChange}
                placeholder="e.g., Software Engineer"
              />
              
              <Input
                label="Company"
                name="company"
                value={newExperience.company}
                onChange={handleExperienceChange}
                placeholder="e.g., Tech Corp"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <Input
                label="Location"
                name="location"
                value={newExperience.location}
                onChange={handleExperienceChange}
                placeholder="e.g., New York, NY (Optional)"
              />
              
              <div className="flex gap-4">
                <Input
                  label="Start Date"
                  name="startDate"
                  type="month"
                  value={newExperience.startDate}
                  onChange={handleExperienceChange}
                />
                
                {!newExperience.current && (
                  <Input
                    label="End Date"
                    name="endDate"
                    type="month"
                    value={newExperience.endDate}
                    onChange={handleExperienceChange}
                  />
                )}
              </div>
            </div>
            
            <div className="mb-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="current"
                  checked={newExperience.current}
                  onChange={handleExperienceChange}
                  className="mr-2"
                />
                <span>I currently work here</span>
              </label>
            </div>
            
            <TextArea
              label="Description"
              name="description"
              value={newExperience.description}
              onChange={handleExperienceChange}
              placeholder="Describe your responsibilities and achievements..."
              rows={3}
            />
            
            <div className="mt-4">
              <Button 
                type="button" 
                onClick={handleAddExperience}
                disabled={!newExperience.title || !newExperience.company}
              >
                Add Experience
              </Button>
            </div>
          </div>
        </Card>
        
        <Card className="p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Education</h2>
          
          {profile.education.map((edu) => (
            <div key={edu.id} className="mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex justify-between">
                <h3 className="font-semibold">{edu.degree}</h3>
                <button 
                  type="button" 
                  className="text-red-600 hover:text-red-800" 
                  onClick={() => handleRemoveEducation(edu.id)}
                >
                  Remove
                </button>
              </div>
              <p className="text-gray-700">{edu.school}</p>
              <p className="text-gray-600">
                {edu.fieldOfStudy && `${edu.fieldOfStudy}, `}
                {edu.startDate} - {edu.current ? 'Present' : edu.endDate}
              </p>
              {edu.description && <p className="mt-2">{edu.description}</p>}
            </div>
          ))}
          
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold mb-3">Add Education</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <Input
                label="Degree"
                name="degree"
                value={newEducation.degree}
                onChange={handleEducationChange}
                placeholder="e.g., Bachelor of Science"
              />
              
              <Input
                label="School"
                name="school"
                value={newEducation.school}
                onChange={handleEducationChange}
                placeholder="e.g., State University"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <Input
                label="Field of Study"
                name="fieldOfStudy"
                value={newEducation.fieldOfStudy}
                onChange={handleEducationChange}
                placeholder="e.g., Computer Science (Optional)"
              />
              
              <div className="flex gap-4">
                <Input
                  label="Start Date"
                  name="startDate"
                  type="month"
                  value={newEducation.startDate}
                  onChange={handleEducationChange}
                />
                
                {!newEducation.current && (
                  <Input
                    label="End Date"
                    name="endDate"
                    type="month"
                    value={newEducation.endDate}
                    onChange={handleEducationChange}
                  />
                )}
              </div>
            </div>
            
            <div className="mb-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="current"
                  checked={newEducation.current}
                  onChange={handleEducationChange}
                  className="mr-2"
                />
                <span>I am currently studying here</span>
              </label>
            </div>
            
            <TextArea
              label="Description"
              name="description"
              value={newEducation.description}
              onChange={handleEducationChange}
              placeholder="Additional information about your education... (Optional)"
              rows={3}
            />
            
            <div className="mt-4">
              <Button 
                type="button" 
                onClick={handleAddEducation}
                disabled={!newEducation.degree || !newEducation.school}
              >
                Add Education
              </Button>
            </div>
          </div>
        </Card>
        
        <Card className="p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Social Profiles</h2>
          
          <div className="grid grid-cols-1 gap-4">
            <Input
              label="LinkedIn URL"
              name="linkedin"
              value={profile.linkedin}
              onChange={handleInputChange}
              placeholder="e.g., https://linkedin.com/in/yourprofile"
            />
            
            <Input
              label="GitHub URL"
              name="github"
              value={profile.github}
              onChange={handleInputChange}
              placeholder="e.g., https://github.com/yourusername"
            />
            
            <Input
              label="Portfolio URL"
              name="portfolio"
              value={profile.portfolio}
              onChange={handleInputChange}
              placeholder="e.g., https://yourportfolio.com"
            />
          </div>
        </Card>
        
        <Card className="p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Notification Preferences</h2>
          
          <div className="space-y-3">
            <label className="flex items-start">
              <input
                type="checkbox"
                name="jobAlerts"
                checked={profile.notifications.jobAlerts}
                onChange={handleNotificationChange}
                className="mt-1 mr-3"
              />
              <div>
                <span className="font-medium">Job Alerts</span>
                <p className="text-sm text-gray-600">Receive notifications about new job postings that match your profile</p>
              </div>
            </label>
            
            <label className="flex items-start">
              <input
                type="checkbox"
                name="applicationUpdates"
                checked={profile.notifications.applicationUpdates}
                onChange={handleNotificationChange}
                className="mt-1 mr-3"
              />
              <div>
                <span className="font-medium">Application Updates</span>
                <p className="text-sm text-gray-600">Get notified when your application status changes</p>
              </div>
            </label>
            
            <label className="flex items-start">
              <input
                type="checkbox"
                name="interviewReminders"
                checked={profile.notifications.interviewReminders}
                onChange={handleNotificationChange}
                className="mt-1 mr-3"
              />
              <div>
                <span className="font-medium">Interview Reminders</span>
                <p className="text-sm text-gray-600">Receive reminders about upcoming interviews</p>
              </div>
            </label>
            
            <label className="flex items-start">
              <input
                type="checkbox"
                name="marketingEmails"
                checked={profile.notifications.marketingEmails}
                onChange={handleNotificationChange}
                className="mt-1 mr-3"
              />
              <div>
                <span className="font-medium">Marketing Emails</span>
                <p className="text-sm text-gray-600">Receive occasional emails about products, features, and updates</p>
              </div>
            </label>
          </div>
        </Card>
        
        <div className="flex justify-end">
          <Button 
            type="submit" 
            disabled={saving}
            loading={saving}
            className="px-6 py-2"
          >
            {saving ? 'Saving...' : 'Save Profile'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default UserProfile;
