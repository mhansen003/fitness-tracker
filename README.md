# Fitness Tracker

A comprehensive web application for tracking your fitness activities, calculating calories burned, and visualizing your progress over time.

## Features

- **User Authentication**: Secure registration, login, and password reset functionality
- **Activity Tracking**: Real-time stopwatch for tracking sitting, standing, walking, and running activities
- **Calorie Calculation**: Automatic calorie calculation based on METs (Metabolic Equivalent of Task) values
- **User Profiles**: Store personal information (age, gender, height, weight) for accurate calorie calculations
- **Calendar View**: Visual calendar showing all your activities by date
- **Statistics Dashboard**: Interactive charts and graphs showing calories burned over time
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Tech Stack

### Frontend
- React 18 with Vite
- React Router for navigation
- Axios for API requests
- Recharts for data visualization
- React Calendar for calendar view

### Backend
- Node.js with Express
- MongoDB with Mongoose
- JWT for authentication
- Bcrypt for password hashing
- Nodemailer for password reset emails

### Deployment
- Vercel (Serverless Functions)
- MongoDB Atlas

## Prerequisites

- Node.js 16+ and npm
- MongoDB Atlas account (or local MongoDB)
- Git

## Installation

### 1. Clone the Repository

```bash
cd C:\GitHub
git clone https://github.com/mhansen003/fitness-tracker.git
cd fitness-tracker
```

### 2. Install Dependencies

```bash
# Install backend dependencies
npm install

# Install frontend dependencies
cd client
npm install
cd ..
```

### 3. Environment Setup

Create a `.env` file in the root directory:

```env
# MongoDB Connection
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/fitness-tracker?retryWrites=true&w=majority

# JWT Secret (use a long random string)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Frontend URL
FRONTEND_URL=http://localhost:5173

# Email Configuration (for password reset)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM="Fitness Tracker <noreply@fitnesstracker.com>"

# Node Environment
NODE_ENV=development
```

Create a `.env` file in the `client` directory:

```env
VITE_API_URL=/api
```

### 4. Set Up MongoDB Atlas

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Create a database user
4. Get your connection string
5. Whitelist your IP address (or use 0.0.0.0/0 for development)
6. Replace the `MONGODB_URI` in your `.env` file

## Running Locally

### Development Mode

```bash
# Terminal 1: Run the frontend
cd client
npm run dev

# Terminal 2: For testing API routes locally, you can use:
# vercel dev
# (Requires Vercel CLI: npm i -g vercel)
```

The application will be available at `http://localhost:5173`

## Deployment to Vercel

### 1. Install Vercel CLI

```bash
npm i -g vercel
```

### 2. Login to Vercel

```bash
vercel login
```

### 3. Configure Environment Variables

In your Vercel dashboard, add these environment variables:

- `MONGODB_URI`
- `JWT_SECRET`
- `FRONTEND_URL` (your production URL)
- `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_USER`, `EMAIL_PASS`, `EMAIL_FROM`

### 4. Deploy

```bash
# From the project root
vercel

# For production deployment
vercel --prod
```

### 5. Connect to GitHub

```bash
# Link to GitHub repository
vercel git connect
```

Now every push to main will automatically deploy!

## Usage

### 1. Register an Account

Visit the application and click "Register" to create a new account.

### 2. Complete Your Profile

After registration, you'll be prompted to enter your:
- Gender
- Age
- Height (cm)
- Weight (kg)

This information is used to calculate calories burned accurately.

### 3. Track Activities

On the Dashboard:
1. Select an activity type (Sitting, Standing, Walking, Running)
2. Click "Start" to begin tracking
3. Click "Stop" when finished
4. For running, enter the distance you covered

### 4. View Your Data

- **Dashboard**: See today's summary and recent activities
- **Calendar**: View activities by date
- **Statistics**: See charts and graphs of your progress over time
- **Profile**: Update your personal information

## Calorie Calculation

The app uses METs (Metabolic Equivalent of Task) to calculate calories:

**Formula**: `Calories/minute = (MET × 3.5 × Weight in kg) / 200`

**MET Values**:
- Sitting: 1.3
- Standing: 1.8
- Walking (3 mph): 3.5
- Running: 8.0-12.5 (varies by speed)

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password

### Profile
- `GET /api/profile` - Get user profile
- `PUT /api/profile` - Update profile

### Activities
- `GET /api/activities` - Get activities (with optional date filters)
- `POST /api/activities` - Create new activity

### Statistics
- `GET /api/stats` - Get statistics (with date range and grouping)

## Project Structure

```
fitness-tracker/
├── api/                    # Vercel serverless functions
│   ├── auth/              # Authentication endpoints
│   ├── activities.js      # Activity endpoints
│   ├── profile.js         # Profile endpoints
│   └── stats.js           # Statistics endpoints
├── client/                # React frontend
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── context/       # React context (Auth)
│   │   ├── pages/         # Page components
│   │   ├── services/      # API services
│   │   └── App.jsx        # Main app component
│   └── package.json
├── config/                # Configuration files
│   └── database.js        # MongoDB connection
├── models/                # MongoDB models
│   ├── User.js
│   └── Activity.js
├── utils/                 # Utility functions
│   ├── auth.js           # Auth helpers
│   ├── calorieCalculator.js
│   └── email.js          # Email helpers
├── .env.example          # Environment variables template
├── .gitignore
├── vercel.json           # Vercel configuration
├── package.json
└── README.md

```

## Contributing

This is a personal project, but suggestions and feedback are welcome!

## License

MIT

## Author

Mark Hansen (mhansen003)

## Support

For issues or questions, please create an issue on GitHub.
# Fitness Tracker - Deployed on Vercel
