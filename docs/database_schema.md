# Database Schema Design

## PostgreSQL (Relational Data)

### Users Table
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'applicant')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### Job Listings Table
```sql
CREATE TABLE job_listings (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    company VARCHAR(255) NOT NULL,
    location VARCHAR(255),
    employment_type VARCHAR(50) CHECK (employment_type IN ('full-time', 'part-time', 'contract', 'internship')),
    experience_level VARCHAR(50),
    salary_min INTEGER,
    salary_max INTEGER,
    description TEXT NOT NULL,
    requirements TEXT,
    responsibilities TEXT,
    admin_id INTEGER REFERENCES users(id),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'closed', 'draft')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### Job Skills Table
```sql
CREATE TABLE job_skills (
    id SERIAL PRIMARY KEY,
    job_id INTEGER REFERENCES job_listings(id) ON DELETE CASCADE,
    skill_name VARCHAR(100) NOT NULL,
    importance VARCHAR(20) CHECK (importance IN ('required', 'preferred', 'nice-to-have'))
);
```

### Resumes Table
```sql
CREATE TABLE resumes (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    file_path VARCHAR(255) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_type VARCHAR(50) NOT NULL,
    is_current BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### Applications Table
```sql
CREATE TABLE applications (
    id SERIAL PRIMARY KEY,
    job_id INTEGER REFERENCES job_listings(id) ON DELETE CASCADE,
    applicant_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    resume_id INTEGER REFERENCES resumes(id),
    status VARCHAR(50) DEFAULT 'applied' CHECK (status IN ('applied', 'reviewed', 'shortlisted', 'rejected', 'interview_scheduled', 'hired')),
    match_score DECIMAL(5,2),
    admin_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(job_id, applicant_id)
);
```

### Interview Slots Table
```sql
CREATE TABLE interview_slots (
    id SERIAL PRIMARY KEY,
    admin_id INTEGER REFERENCES users(id),
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE NOT NULL,
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### Interviews Table
```sql
CREATE TABLE interviews (
    id SERIAL PRIMARY KEY,
    application_id INTEGER REFERENCES applications(id) ON DELETE CASCADE,
    slot_id INTEGER REFERENCES interview_slots(id),
    meeting_link VARCHAR(255),
    notes TEXT,
    status VARCHAR(50) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled', 'rescheduled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### Notifications Table
```sql
CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    notification_type VARCHAR(50) NOT NULL,
    related_id INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

## MongoDB (NoSQL Data)

### Parsed Resumes Collection
```javascript
{
  _id: ObjectId,
  userId: Number,
  resumeId: Number,
  parsed_data: {
    personal_info: {
      name: String,
      email: String,
      phone: String,
      location: String,
      linkedin: String,
      website: String
    },
    summary: String,
    skills: [
      {
        name: String,
        level: String,
        years: Number,
        keywords: [String]
      }
    ],
    experience: [
      {
        title: String,
        company: String,
        location: String,
        start_date: Date,
        end_date: Date,
        description: String,
        highlights: [String],
        technologies: [String]
      }
    ],
    education: [
      {
        degree: String,
        institution: String,
        location: String,
        start_date: Date,
        end_date: Date,
        gpa: Number,
        courses: [String]
      }
    ],
    certifications: [
      {
        name: String,
        issuer: String,
        date: Date,
        expires: Date
      }
    ],
    projects: [
      {
        name: String,
        description: String,
        technologies: [String],
        url: String
      }
    ],
    languages: [
      {
        name: String,
        proficiency: String
      }
    ]
  },
  gaps: [
    {
      section: String,
      missing: String,
      importance: String
    }
  ],
  raw_text: String,
  created_at: Date,
  updated_at: Date
}
```

### Parsed Job Descriptions Collection
```javascript
{
  _id: ObjectId,
  jobId: Number,
  parsed_data: {
    title: String,
    company: String,
    location: String,
    employment_type: String,
    seniority_level: String,
    department: String,
    key_responsibilities: [String],
    required_skills: [
      {
        name: String,
        importance: String,
        years: Number,
        keywords: [String]
      }
    ],
    required_experience: [String],
    required_education: [
      {
        degree: String,
        field: String,
        importance: String
      }
    ],
    preferred_qualifications: [String],
    benefits: [String],
    salary_range: {
      min: Number,
      max: Number,
      currency: String
    }
  },
  gaps: [
    {
      section: String,
      missing: String,
      importance: String
    }
  ],
  raw_text: String,
  created_at: Date,
  updated_at: Date
}
```

### Matching Results Collection
```javascript
{
  _id: ObjectId,
  jobId: Number,
  applicantId: Number,
  resumeId: Number,
  applicationId: Number,
  overall_match_score: Number,
  skill_match: {
    score: Number,
    matched_skills: [
      {
        skill: String,
        resume_level: String,
        job_importance: String,
        match_score: Number
      }
    ],
    missing_skills: [String]
  },
  experience_match: {
    score: Number,
    relevant_experiences: [
      {
        title: String,
        company: String,
        relevance_score: Number
      }
    ]
  },
  education_match: {
    score: Number,
    matches: [
      {
        degree: String,
        field: String,
        match_score: Number
      }
    ]
  },
  detailed_analysis: String,
  created_at: Date
}
```
