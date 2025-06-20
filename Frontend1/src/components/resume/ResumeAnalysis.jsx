import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { getResumeAnalysis } from '../../services/resume.service';
import Button from '../ui/Button';
import Card from '../ui/Card';
import Loading from '../ui/Loading';
import Badge from '../ui/Badge';

const ResumeAnalysis = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchResumeAnalysis = async () => {
      try {
        setLoading(true);
        if (!user || !user.resumeId) {
          // No resume uploaded yet
          setLoading(false);
          return;
        }
        
        const analysisData = await getResumeAnalysis(user.resumeId);
        setAnalysis(analysisData);
      } catch (err) {
        console.error('Error fetching resume analysis:', err);
        setError('Failed to load resume analysis. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchResumeAnalysis();
  }, [user]);

  if (loading) return <Loading />;

  if (!user || !user.resumeId) {
    return (
      <Card className="p-6 text-center">
        <h2 className="text-xl mb-4">You haven't uploaded a resume yet</h2>
        <p className="mb-6 text-gray-600">
          Upload your resume to get AI-powered analysis and job matching recommendations.
        </p>
        <Button onClick={() => navigate('/resume/upload')}>
          Upload Resume
        </Button>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-6 text-center">
        <h2 className="text-xl text-red-600 mb-4">{error}</h2>
        <Button 
          variant="outline" 
          onClick={() => window.location.reload()}
        >
          Try Again
        </Button>
      </Card>
    );
  }

  const getScoreColor = (score) => {
    if (score >= 80) return 'green';
    if (score >= 60) return 'yellow';
    if (score >= 40) return 'orange';
    return 'red';
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="p-6 mb-6">
        <h1 className="text-2xl font-bold mb-6">Resume Analysis</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-gray-50 p-4 rounded-lg text-center">
            <h3 className="text-lg font-semibold mb-2">Overall Score</h3>
            <div className={`text-3xl font-bold text-${getScoreColor(analysis.overallScore)}-600`}>
              {analysis.overallScore}/100
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg text-center">
            <h3 className="text-lg font-semibold mb-2">Skills Match</h3>
            <div className={`text-3xl font-bold text-${getScoreColor(analysis.skillsMatchScore)}-600`}>
              {analysis.skillsMatchScore}/100
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg text-center">
            <h3 className="text-lg font-semibold mb-2">Experience Match</h3>
            <div className={`text-3xl font-bold text-${getScoreColor(analysis.experienceMatchScore)}-600`}>
              {analysis.experienceMatchScore}/100
            </div>
          </div>
        </div>
        
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Key Skills Detected</h2>
          <div className="flex flex-wrap gap-2">
            {analysis.skills.map((skill, index) => (
              <Badge 
                key={index} 
                color={skill.level === 'expert' ? 'green' : skill.level === 'intermediate' ? 'blue' : 'gray'}
              >
                {skill.name} {skill.level === 'expert' && '★★★'} 
                {skill.level === 'intermediate' && '★★'} 
                {skill.level === 'beginner' && '★'}
              </Badge>
            ))}
          </div>
        </div>
        
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Recommendations</h2>
          <div className="space-y-4">
            {analysis.recommendations.map((rec, index) => (
              <div key={index} className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">{rec.title}</h3>
                <p>{rec.description}</p>
              </div>
            ))}
          </div>
        </div>
        
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Resume Strengths</h2>
          <ul className="list-disc pl-5 space-y-2">
            {analysis.strengths.map((strength, index) => (
              <li key={index}>{strength}</li>
            ))}
          </ul>
        </div>
        
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Areas for Improvement</h2>
          <ul className="list-disc pl-5 space-y-2">
            {analysis.areasForImprovement.map((area, index) => (
              <li key={index}>{area}</li>
            ))}
          </ul>
        </div>
        
        {analysis.jobMatches && analysis.jobMatches.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Recommended Jobs</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {analysis.jobMatches.map((job, index) => (
                <Card key={index} className="p-4 hover:shadow-md transition-shadow">
                  <h3 className="font-semibold mb-2">{job.title}</h3>
                  <p className="text-gray-600 mb-2">{job.company}</p>
                  <div className="flex justify-between items-center">
                    <Badge color={getScoreColor(job.matchScore)}>
                      {job.matchScore}% Match
                    </Badge>
                    <Button 
                      size="sm" 
                      onClick={() => navigate(`/jobs/${job.id}`)}
                    >
                      View Job
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
        
        <div className="mt-8 flex justify-center">
          <Button onClick={() => navigate('/resume/upload')}>
            Upload New Resume
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default ResumeAnalysis;
