import React, { useState } from 'react';
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
} from '@heroicons/react/24/outline';

const ResumeAnalysis = ({ resumeData }) => {
  const [activeTab, setActiveTab] = useState('summary');
  
  if (!resumeData) {
    return (
      <div className="text-center py-8">
        <InformationCircleIcon className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-lg font-medium text-gray-900">No resume data available</h3>
        <p className="mt-1 text-sm text-gray-500">Please upload a resume to see analysis.</p>
      </div>
    );
  }
  
  const { parsedData, missingInfo } = resumeData;
  
  // Get completion score based on missing info
  const getCompletionScore = () => {
    if (!missingInfo || missingInfo.length === 0) return 100;
    
    const maxItems = 10; // Maximum number of possible missing items
    const missing = Math.min(missingInfo.length, maxItems);
    
    return Math.round(((maxItems - missing) / maxItems) * 100);
  };
  
  // Get completion color based on score
  const getCompletionColor = (score) => {
    if (score >= 80) return 'text-success-500';
    if (score >= 60) return 'text-warning-500';
    return 'text-danger-500';
  };
  
  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'Present';
    
    const date = new Date(dateString);
    if (isNaN(date)) return dateString;
    
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
    });
  };
  
  // Get skill level badge color
  const getSkillLevelColor = (level) => {
    if (!level) return 'bg-gray-100 text-gray-800';
    
    const levelLower = level.toLowerCase();
    if (levelLower.includes('expert') || levelLower.includes('advanced')) {
      return 'bg-success-100 text-success-800';
    }
    if (levelLower.includes('intermediate')) {
      return 'bg-warning-100 text-warning-800';
    }
    if (levelLower.includes('beginner') || levelLower.includes('basic')) {
      return 'bg-danger-100 text-danger-800';
    }
    
    return 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      {/* Header with completion score */}
      <div className="bg-gray-50 px-4 py-5 border-b border-gray-200 sm:px-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">Resume Analysis</h3>
          
          <div className="flex items-center">
            <div className={`text-lg font-bold ${getCompletionColor(getCompletionScore())}`}>
              {getCompletionScore()}%
            </div>
            <span className="ml-1 text-sm text-gray-500">Complete</span>
          </div>
        </div>
      </div>
      
      {/* Tab navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex -mb-px" aria-label="Tabs">
          <button
            className={`${
              activeTab === 'summary'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-4 border-b-2 font-medium text-sm`}
            onClick={() => setActiveTab('summary')}
          >
            Summary
          </button>
          <button
            className={`${
              activeTab === 'experience'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-4 border-b-2 font-medium text-sm`}
            onClick={() => setActiveTab('experience')}
          >
            Experience
          </button>
          <button
            className={`${
              activeTab === 'education'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-4 border-b-2 font-medium text-sm`}
            onClick={() => setActiveTab('education')}
          >
            Education
          </button>
          <button
            className={`${
              activeTab === 'skills'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-4 border-b-2 font-medium text-sm`}
            onClick={() => setActiveTab('skills')}
          >
            Skills
          </button>
          <button
            className={`${
              activeTab === 'improvements'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-4 border-b-2 font-medium text-sm`}
            onClick={() => setActiveTab('improvements')}
          >
            Improvements
          </button>
        </nav>
      </div>
      
      {/* Tab content */}
      <div className="p-4 sm:p-6">
        {/* Summary tab */}
        {activeTab === 'summary' && (
          <div>
            <h4 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h4>
            
            <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
              <div>
                <dt className="text-sm font-medium text-gray-500">Full Name</dt>
                <dd className="mt-1 text-sm text-gray-900">{parsedData.personalInfo.name || 'Not provided'}</dd>
              </div>
              
              <div>
                <dt className="text-sm font-medium text-gray-500">Email</dt>
                <dd className="mt-1 text-sm text-gray-900">{parsedData.personalInfo.email || 'Not provided'}</dd>
              </div>
              
              <div>
                <dt className="text-sm font-medium text-gray-500">Phone</dt>
                <dd className="mt-1 text-sm text-gray-900">{parsedData.personalInfo.phone || 'Not provided'}</dd>
              </div>
              
              <div>
                <dt className="text-sm font-medium text-gray-500">Location</dt>
                <dd className="mt-1 text-sm text-gray-900">{parsedData.personalInfo.address || 'Not provided'}</dd>
              </div>
              
              <div>
                <dt className="text-sm font-medium text-gray-500">LinkedIn</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {parsedData.personalInfo.linkedin ? (
                    <a 
                      href={parsedData.personalInfo.linkedin} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary-600 hover:text-primary-700"
                    >
                      {parsedData.personalInfo.linkedin}
                    </a>
                  ) : (
                    'Not provided'
                  )}
                </dd>
              </div>
              
              <div>
                <dt className="text-sm font-medium text-gray-500">Website</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {parsedData.personalInfo.website ? (
                    <a 
                      href={parsedData.personalInfo.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary-600 hover:text-primary-700"
                    >
                      {parsedData.personalInfo.website}
                    </a>
                  ) : (
                    'Not provided'
                  )}
                </dd>
              </div>
            </dl>
            
            <div className="mt-8">
              <h4 className="text-lg font-medium text-gray-900 mb-4">Overview</h4>
              
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h5 className="text-sm font-medium text-gray-500">Experience</h5>
                  <p className="mt-1 text-lg font-semibold text-gray-900">
                    {parsedData.experience?.length || 0} {parsedData.experience?.length === 1 ? 'Entry' : 'Entries'}
                  </p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h5 className="text-sm font-medium text-gray-500">Education</h5>
                  <p className="mt-1 text-lg font-semibold text-gray-900">
                    {parsedData.education?.length || 0} {parsedData.education?.length === 1 ? 'Entry' : 'Entries'}
                  </p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h5 className="text-sm font-medium text-gray-500">Skills</h5>
                  <p className="mt-1 text-lg font-semibold text-gray-900">
                    {parsedData.skills?.length || 0} {parsedData.skills?.length === 1 ? 'Skill' : 'Skills'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Experience tab */}
        {activeTab === 'experience' && (
          <div>
            <h4 className="text-lg font-medium text-gray-900 mb-4">Work Experience</h4>
            
            {parsedData.experience && parsedData.experience.length > 0 ? (
              <div className="space-y-6">
                {parsedData.experience.map((exp, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <h5 className="text-base font-medium text-gray-900">{exp.position || 'Position not specified'}</h5>
                        <p className="text-sm text-gray-600">{exp.company || 'Company not specified'}</p>
                        {exp.location && (
                          <p className="text-sm text-gray-500">{exp.location}</p>
                        )}
                      </div>
                      
                      <div className="text-sm text-gray-500">
                        {formatDate(exp.startDate)} - {formatDate(exp.endDate)}
                      </div>
                    </div>
                    
                    {exp.description && (
                      <div className="mt-3 text-sm text-gray-700">
                        <p>{exp.description}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <ExclamationCircleIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-base font-medium text-gray-900">No experience data found</h3>
                <p className="mt-1 text-sm text-gray-500">We couldn't extract any work experience from your resume.</p>
              </div>
            )}
          </div>
        )}
        
        {/* Education tab */}
        {activeTab === 'education' && (
          <div>
            <h4 className="text-lg font-medium text-gray-900 mb-4">Education</h4>
            
            {parsedData.education && parsedData.education.length > 0 ? (
              <div className="space-y-6">
                {parsedData.education.map((edu, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <h5 className="text-base font-medium text-gray-900">{edu.degree || 'Degree not specified'}</h5>
                        <p className="text-sm text-gray-600">{edu.institution || 'Institution not specified'}</p>
                        {edu.field && (
                          <p className="text-sm text-gray-500">{edu.field}</p>
                        )}
                        {edu.gpa && (
                          <p className="text-sm text-gray-500">GPA: {edu.gpa}</p>
                        )}
                      </div>
                      
                      <div className="text-sm text-gray-500">
                        {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <ExclamationCircleIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-base font-medium text-gray-900">No education data found</h3>
                <p className="mt-1 text-sm text-gray-500">We couldn't extract any education information from your resume.</p>
              </div>
            )}
          </div>
        )}
        
        {/* Skills tab */}
        {activeTab === 'skills' && (
          <div>
            <h4 className="text-lg font-medium text-gray-900 mb-4">Skills</h4>
            
            {parsedData.skills && parsedData.skills.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {parsedData.skills.map((skill, index) => (
                  <div 
                    key={index} 
                    className={`inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium ${getSkillLevelColor(skill.level)}`}
                  >
                    {skill.name}
                    {skill.level && (
                      <span className="ml-1 text-xs opacity-75">({skill.level})</span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <ExclamationCircleIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-base font-medium text-gray-900">No skills found</h3>
                <p className="mt-1 text-sm text-gray-500">We couldn't extract any skills from your resume.</p>
              </div>
            )}
            
            {parsedData.languages && parsedData.languages.length > 0 && (
              <div className="mt-8">
                <h4 className="text-lg font-medium text-gray-900 mb-4">Languages</h4>
                
                <div className="flex flex-wrap gap-2">
                  {parsedData.languages.map((language, index) => (
                    <div 
                      key={index} 
                      className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                    >
                      {language.name}
                      {language.proficiency && (
                        <span className="ml-1 text-xs opacity-75">({language.proficiency})</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {parsedData.certifications && parsedData.certifications.length > 0 && (
              <div className="mt-8">
                <h4 className="text-lg font-medium text-gray-900 mb-4">Certifications</h4>
                
                <ul className="space-y-2">
                  {parsedData.certifications.map((cert, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircleIcon className="h-5 w-5 text-success-500 mr-2 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{cert.name}</p>
                        {cert.issuer && (
                          <p className="text-sm text-gray-500">Issued by {cert.issuer}</p>
                        )}
                        {cert.date && (
                          <p className="text-xs text-gray-500">
                            {formatDate(cert.date)}
                            {cert.expiryDate && ` - ${formatDate(cert.expiryDate)}`}
                          </p>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
        
        {/* Improvements tab */}
        {activeTab === 'improvements' && (
          <div>
            <h4 className="text-lg font-medium text-gray-900 mb-4">Suggested Improvements</h4>
            
            {missingInfo && missingInfo.length > 0 ? (
              <div className="space-y-4">
                <div className="p-4 bg-warning-50 border border-warning-200 rounded-md">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <ExclamationTriangleIcon className="h-5 w-5 text-warning-400" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-warning-800">
                        We found {missingInfo.length} {missingInfo.length === 1 ? 'issue' : 'issues'} in your resume
                      </h3>
                      <p className="text-sm text-warning-700 mt-1">
                        Addressing these issues can improve your chances of getting matched with relevant job opportunities.
                      </p>
                    </div>
                  </div>
                </div>
                
                <ul className="space-y-3">
                  {missingInfo.map((issue, index) => (
                    <li key={index} className="bg-gray-50 p-3 rounded-md flex items-start">
                      <ExclamationCircleIcon className="h-5 w-5 text-danger-500 mr-2 mt-0.5" />
                      <span className="text-sm text-gray-700">{issue}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="text-center py-8 bg-success-50 rounded-lg border border-success-200">
                <CheckCircleIcon className="mx-auto h-12 w-12 text-success-500" />
                <h3 className="mt-2 text-base font-medium text-success-800">Your resume looks great!</h3>
                <p className="mt-1 text-sm text-success-700">We didn't find any issues that need improvement.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumeAnalysis;
