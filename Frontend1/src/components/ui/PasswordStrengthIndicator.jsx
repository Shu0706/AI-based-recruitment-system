import React from 'react';

const PasswordStrengthIndicator = ({ password }) => {
  const calculateStrength = (password) => {
    let score = 0;
    let feedback = [];

    if (!password) return { score: 0, feedback: [], strength: 'Very Weak' };

    // Length check
    if (password.length >= 8) {
      score += 1;
    } else {
      feedback.push('At least 8 characters');
    }

    // Uppercase check
    if (/[A-Z]/.test(password)) {
      score += 1;
    } else {
      feedback.push('One uppercase letter');
    }

    // Lowercase check
    if (/[a-z]/.test(password)) {
      score += 1;
    } else {
      feedback.push('One lowercase letter');
    }

    // Number check
    if (/\d/.test(password)) {
      score += 1;
    } else {
      feedback.push('One number');
    }

    // Special character check
    if (/[@$!%*?&]/.test(password)) {
      score += 1;
    } else {
      feedback.push('One special character (@$!%*?&)');
    }

    const strengths = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
    const strength = strengths[score] || 'Very Weak';

    return { score, feedback, strength };
  };

  const { score, feedback, strength } = calculateStrength(password);
  
  const getStrengthColor = (score) => {
    if (score <= 1) return 'bg-red-500';
    if (score <= 2) return 'bg-orange-500';
    if (score <= 3) return 'bg-yellow-500';
    if (score <= 4) return 'bg-blue-500';
    return 'bg-green-500';
  };

  const getTextColor = (score) => {
    if (score <= 1) return 'text-red-600';
    if (score <= 2) return 'text-orange-600';
    if (score <= 3) return 'text-yellow-600';
    if (score <= 4) return 'text-blue-600';
    return 'text-green-600';
  };

  if (!password) return null;

  return (
    <div className="mt-2">
      <div className="flex items-center space-x-2">
        <div className="flex-1 bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${getStrengthColor(score)}`}
            style={{ width: `${(score / 5) * 100}%` }}
          ></div>
        </div>
        <span className={`text-sm font-medium ${getTextColor(score)}`}>
          {strength}
        </span>
      </div>
      
      {feedback.length > 0 && (
        <div className="mt-1">
          <p className="text-xs text-gray-600">Missing:</p>
          <ul className="text-xs text-gray-500 list-disc list-inside">
            {feedback.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default PasswordStrengthIndicator;
