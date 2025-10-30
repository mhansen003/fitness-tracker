# Deployment Guide

## Step 1: Create GitHub Repository

Since the GitHub CLI isn't installed, create the repository manually:

1. Go to https://github.com/new
2. Repository name: `fitness-tracker`
3. Description: "A comprehensive fitness tracking web app with activity monitoring, calorie calculation, and progress visualization"
4. Make it **Public**
5. **DO NOT** initialize with README (we already have one)
6. Click "Create repository"

Then push your code:

```bash
cd C:\GitHub\fitness-tracker
git remote add origin https://github.com/mhansen003/fitness-tracker.git
git branch -M main
git push -u origin main
```

## Step 2: Set Up MongoDB Atlas

1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up or login
3. Create a **FREE** cluster (M0 Sandbox)
4. Choose a cloud provider and region (AWS, Google Cloud, or Azure)
5. Click "Create Cluster" (takes a few minutes)

### Configure Database Access

1. Go to "Database Access" in the left sidebar
2. Click "Add New Database User"
3. Create a user with username and password
4. **Save these credentials!** You'll need them later
5. Set privileges to "Read and write to any database"

### Configure Network Access

1. Go to "Network Access" in the left sidebar
2. Click "Add IP Address"
3. For development/testing, click "Allow Access from Anywhere" (0.0.0.0/0)
4. For production, you can restrict this later

### Get Connection String

1. Go to "Database" in the left sidebar
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Copy the connection string
5. It looks like: `mongodb+srv://username:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority`
6. Replace `<password>` with your actual password
7. Add `/fitness-tracker` before the `?` to specify the database name

## Step 3: Deploy to Vercel

### Option A: Via Vercel Dashboard (Recommended)

1. Go to https://vercel.com
2. Sign up or login (you can use your GitHub account)
3. Click "Add New" → "Project"
4. Import your `mhansen003/fitness-tracker` repository
5. Configure build settings:
   - **Framework Preset**: Vite
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

6. Add Environment Variables:
   Click "Environment Variables" and add these:

   ```
   MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/fitness-tracker?retryWrites=true&w=majority
   JWT_SECRET=your-super-secret-random-string-make-it-long
   FRONTEND_URL=https://your-app-name.vercel.app
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-gmail-app-password
   EMAIL_FROM="Fitness Tracker <noreply@fitnesstracker.com>"
   ```

7. Click "Deploy"
8. Wait for deployment to complete
9. Visit your app at the provided URL!

### Option B: Via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy from project root
cd C:\GitHub\fitness-tracker
vercel

# Follow the prompts:
# - Link to existing project? No
# - Project name: fitness-tracker
# - Which directory is your code? ./
# - Want to override settings? Yes
# - What's your Build Command? cd client && npm run build
# - What's your Output Directory? client/dist
# - Development Command? npm run dev

# Add environment variables (do this once)
vercel env add MONGODB_URI
vercel env add JWT_SECRET
vercel env add FRONTEND_URL
# ... etc

# Deploy to production
vercel --prod
```

## Step 4: Configure Email (Optional)

For password reset functionality, you need an email service.

### Using Gmail:

1. Enable 2-Factor Authentication on your Gmail account
2. Generate an App Password:
   - Go to Google Account → Security
   - Under "Signing in to Google" → App passwords
   - Generate a password for "Mail"
3. Use this app password in your `EMAIL_PASS` environment variable

### Using SendGrid (Alternative):

1. Sign up at https://sendgrid.com (free tier available)
2. Create an API key
3. Update environment variables:
   ```
   EMAIL_HOST=smtp.sendgrid.net
   EMAIL_PORT=587
   EMAIL_USER=apikey
   EMAIL_PASS=your-sendgrid-api-key
   ```

## Step 5: Test Your Application

1. Visit your deployed URL
2. Register a new account
3. Complete your profile
4. Track some activities
5. View the calendar and statistics

## Troubleshooting

### MongoDB Connection Issues

- Check that your IP is whitelisted (0.0.0.0/0 for testing)
- Verify connection string has the correct password
- Ensure database name is included in the connection string

### Vercel Build Fails

- Check that environment variables are set correctly
- Verify the build command and output directory
- Check build logs for specific errors

### Email Not Working

- For Gmail, ensure you're using an App Password, not your regular password
- Check that 2FA is enabled on your Google account
- For development, the app will use Ethereal (test email service) if EMAIL_HOST is not configured

### API Routes Not Working

- Verify that vercel.json is configured correctly
- Check that MONGODB_URI is set in Vercel environment variables
- Look at Vercel function logs for errors

## Environment Variables Summary

Required for production:

- `MONGODB_URI` - MongoDB Atlas connection string
- `JWT_SECRET` - Random secret key for JWT tokens (use a long random string)
- `FRONTEND_URL` - Your Vercel app URL

Optional (for password reset):

- `EMAIL_HOST` - SMTP host (e.g., smtp.gmail.com)
- `EMAIL_PORT` - SMTP port (usually 587)
- `EMAIL_USER` - Your email address
- `EMAIL_PASS` - Your email password or app password
- `EMAIL_FROM` - Display name for emails

## Updating Your App

After pushing changes to GitHub, Vercel will automatically redeploy:

```bash
git add .
git commit -m "Your commit message"
git push
```

## Custom Domain (Optional)

1. Go to your project in Vercel dashboard
2. Settings → Domains
3. Add your custom domain
4. Follow DNS configuration instructions
5. Update `FRONTEND_URL` environment variable with your custom domain

## Monitoring

- **Vercel Dashboard**: View deployments, logs, and analytics
- **MongoDB Atlas**: Monitor database usage and performance
- **Error Tracking**: Consider adding Sentry for production error tracking

## Cost Breakdown

- **Vercel**: FREE for hobby projects (100GB bandwidth, unlimited projects)
- **MongoDB Atlas**: FREE tier (512MB storage, shared CPU)
- **GitHub**: FREE for public repositories
- **Total**: $0/month for personal use!

For production with higher traffic, both Vercel and MongoDB Atlas have affordable paid tiers.
