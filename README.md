# BritishBaccy Registration System

A complete user authentication system for the BritishBaccy e-commerce website with backend API integration placeholders.

## 🚀 Features

### Frontend Features
- ✅ User Registration with validation
- ✅ User Login with "Remember Me" option
- ✅ Password Reset functionality
- ✅ User Profile management
- ✅ Form validation and error handling
- ✅ Loading states and success messages
- ✅ Responsive design
- ✅ Demo mode (works without backend)

### Backend Features (Ready to Connect)
- ✅ Express.js server with security middleware
- ✅ JWT authentication
- ✅ Password hashing with bcrypt
- ✅ Rate limiting
- ✅ Email verification system (placeholder)
- ✅ Database integration (Firebase/MongoDB placeholders)
- ✅ Email service integration (SendGrid/Nodemailer placeholders)
- ✅ Comprehensive API endpoints

## 📁 File Structure

```
BBsite/
├── britishbaccy-singlefileORIG.html  # Main website with registration system
├── server.js                         # Backend API server
├── package.json                      # Dependencies
├── success.html                      # Registration success page
├── cancel.html                       # Error/cancellation page
└── README.md                         # This file
```

## 🛠️ Quick Setup

### 1. Install Dependencies
```bash
npm install
```

**Note:** If you encounter security vulnerabilities during installation, run:
```bash
npm audit fix --force
```

This will automatically update packages to secure versions. You may see some warnings about deprecated packages or major version changes - this is normal and the system will work correctly.

**Common npm messages you might see:**
- Funding requests: These are optional sponsorship requests from package maintainers
- Deprecated package warnings: Packages are still functional, just older versions
- Vulnerability fixes: Automatically resolved with `npm audit fix --force`

### 2. Start the Backend Server
```bash
npm start
# or for development
npm run dev
```

### 3. Open the Website
Open `britishbaccy-singlefileORIG.html` in your browser or serve it with a local server.

## 🔧 Backend Integration Steps

### Step 1: Update API URL
In `britishbaccy-singlefileORIG.html`, find this line and update it:
```javascript
const API_BASE_URL = 'http://localhost:3000'; // Change to your deployed backend URL
```

### Step 2: Choose and Setup Database

#### Option A: Firebase
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable Authentication and Firestore
4. Download service account key
5. In `server.js`, uncomment Firebase code section and add your config

#### Option B: MongoDB
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Get connection string
4. In `server.js`, uncomment MongoDB code section and add your connection string

### Step 3: Setup Email Service

#### Option A: SendGrid
1. Go to [SendGrid](https://sendgrid.com/)
2. Create account and get API key
3. In `server.js`, uncomment SendGrid code section and add your API key

#### Option B: Nodemailer (Gmail)
1. Enable 2-factor authentication on Gmail
2. Generate app password
3. In `server.js`, uncomment Nodemailer code section and add credentials

### Step 4: Environment Variables
Create a `.env` file in your project root:
```env
JWT_SECRET=your_super_secure_random_string_here_make_it_long_and_complex
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/britishbaccy
SENDGRID_API_KEY=your_sendgrid_api_key_here
STRIPE_SECRET_KEY=your_stripe_secret_key_here
FRONTEND_URL=http://localhost:3000
PORT=3000
```

### Step 5: Remove Demo Mode
1. Search for "REMOVE THIS WHEN BACKEND IS READY" in the HTML file
2. Remove all demo mode code blocks
3. Remove fallback code in catch blocks

## 📋 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/register` | User registration |
| POST | `/api/login` | User login |
| POST | `/api/logout` | User logout |
| GET | `/api/profile` | Get user profile |
| PUT | `/api/profile` | Update user profile |
| POST | `/api/forgot-password` | Request password reset |
| POST | `/api/reset-password` | Reset password |
| POST | `/api/verify-email` | Verify email address |

## 🎨 Frontend Components

### Registration Form
- Email validation
- Password strength requirements
- Confirm password matching
- Nickname field
- Real-time error display
- Loading states

### Login Form
- Email/password authentication
- "Remember me" functionality
- Error handling
- Success redirects

### Profile Page
- User avatar (generated from nickname)
- Account information display
- Profile editing
- Account statistics
- Logout functionality

### Password Reset
- Email-based reset requests
- Secure token validation
- New password setting

## 🔒 Security Features

- JWT token authentication
- Password hashing with bcrypt (12 rounds)
- Rate limiting on auth endpoints
- CORS protection
- Helmet security headers
- Input validation
- XSS protection
- SQL injection prevention

## 🚀 Deployment Options

### Frontend Deployment
- **Netlify**: Drag and drop the HTML file
- **Vercel**: Connect GitHub repo
- **GitHub Pages**: Push to gh-pages branch
- **Any web hosting**: Upload HTML file

### Backend Deployment
- **Heroku**: `git push heroku main`
- **Railway**: Connect GitHub repo
- **DigitalOcean**: Deploy on droplet
- **AWS/Google Cloud**: Use their hosting services

## 🧪 Testing the System

### Manual Testing Checklist
- [ ] Register new account
- [ ] Receive verification email (if enabled)
- [ ] Login with credentials
- [ ] Access profile page
- [ ] Update profile information
- [ ] Request password reset
- [ ] Logout functionality
- [ ] Form validation errors
- [ ] Network error handling

### Demo Mode Testing
The system includes demo mode that works without a backend:
1. Try registering - shows success message
2. Try logging in - creates demo user
3. Access profile page - shows demo data
4. All forms show appropriate feedback

## 🔧 Customization

### Styling
- All styles are in the `<style>` section of the HTML file
- Uses CSS custom properties for easy color changes
- Responsive design with mobile breakpoints

### Form Fields
- Add/remove fields in the HTML forms
- Update validation in JavaScript functions
- Modify backend API to handle new fields

### Email Templates
- Customize email content in `server.js`
- Add HTML templates for better formatting
- Include company branding

## 📞 Support & Contact

For questions about this registration system:
- Email: BritishBaccy@gmail.com
- Phone: 07423544954
- Available: Monday to Friday, 10:00am to 09:00pm

## 🔄 Updates & Maintenance

### Regular Tasks
- Update dependencies monthly
- Monitor authentication logs
- Review security settings
- Backup user data
- Test email delivery

### Security Updates
- Rotate JWT secrets regularly
- Update password hashing if needed
- Monitor for security vulnerabilities
- Keep dependencies updated

## 📝 Notes

- The system is designed to work with or without a backend
- Demo mode allows testing without server setup
- All placeholder comments clearly indicate what needs to be replaced
- Comprehensive error handling for network issues
- Mobile-responsive design
- Accessible form elements with proper labels

---

**Ready to go live?** Follow the integration steps above and remove the demo mode code for a production-ready authentication system!
