# AI-based Recruitment System Frontend

This is the frontend for the AI-based Recruitment System, a modern web application for managing the recruitment process with AI capabilities.

## Features

- **User Authentication**: Secure login and registration system with role-based access (Admin/User)
- **Job Management**: Create, edit, and manage job postings
- **Resume Parsing**: AI-powered resume analysis and parsing
- **Candidate Matching**: Automatically match candidates to jobs based on skills and qualifications
- **Interview Scheduling**: Manage and schedule interviews with candidates
- **Dashboard**: Comprehensive dashboards for both admin and user roles
- **Responsive Design**: Mobile-friendly interface using Tailwind CSS

## Tech Stack

- **React**: Frontend framework
- **Vite**: Build tool and development server
- **React Router**: For navigation
- **Formik & Yup**: Form handling and validation
- **Tailwind CSS**: Utility-first CSS framework
- **Axios**: HTTP client for API requests
- **React Toastify**: Toast notifications
- **Chart.js**: For data visualization
- **Heroicons**: SVG icons library

## Getting Started

### Prerequisites

- Node.js (v14.0.0 or later)
- npm or yarn
- Backend API running (see backend README)

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/AI-based-recruitment-system.git
cd AI-based-recruitment-system/frontend
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Create a `.env` file in the root directory and add the following:

```
VITE_API_URL=http://localhost:5000/api
```

4. Start the development server:

```bash
npm run dev
# or
yarn dev
```

The application will be available at http://localhost:3000.

## Project Structure

```
frontend/
├── public/                 # Static assets
├── src/
│   ├── assets/             # Images, fonts, etc.
│   ├── components/         # Reusable components
│   │   ├── admin/          # Admin-specific components
│   │   ├── layouts/        # Layout components
│   │   └── resume/         # Resume-related components
│   ├── config/             # Configuration files
│   ├── context/            # React context providers
│   ├── hooks/              # Custom React hooks
│   ├── pages/              # Page components
│   │   ├── admin/          # Admin pages
│   │   ├── auth/           # Authentication pages
│   │   └── user/           # User pages
│   ├── services/           # API service functions
│   ├── utils/              # Utility functions
│   ├── App.css             # Global styles
│   ├── App.jsx              # Main App component
│   ├── index.css           # Base styles and Tailwind directives
│   └── main.jsx            # Entry point
├── .env                    # Environment variables
├── .eslintrc.cjs           # ESLint configuration
├── index.html              # HTML template
├── package.json            # Dependencies and scripts
├── postcss.config.js       # PostCSS configuration
├── tailwind.config.js      # Tailwind CSS configuration
└── vite.config.js          # Vite configuration
```

## Available Scripts

- `npm run dev` - Start development server

## Authentication and Routing

The application uses a context-based authentication system with protected routes. There are two main user roles:

1. **Admin**: Can manage jobs, view candidates, schedule interviews, etc.
2. **User**: Can search for jobs, submit applications, manage their resume, etc.

## Component Showcase

### Create Job Form

The enhanced Create Job form (`components/admin/CreateJobForm.jsx`) features:

- Formik form validation with Yup schema
- Dynamic fields for requirements, responsibilities, and benefits
- Live preview mode to see how the job posting will look
- Modern UI with Tailwind CSS and Heroicons
- Error handling and user feedback
- Responsive design for all devices

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
