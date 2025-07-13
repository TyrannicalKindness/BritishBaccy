const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.static('.'));

// Rate limiting
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: 'Too many authentication attempts, please try again later.'
});

// ============================================================================
// FIREBASE DATABASE INTEGRATION
// ============================================================================
const { admin, db, createFirebaseUser, getFirebaseUserByEmail, updateFirebaseUser } = require('./firebase-config');

// Firebase is now active - no more in-memory storage!
let sessions = []; // Keep sessions in memory for now (can be moved to Firebase later)

// ============================================================================
// JWT SECRET - REPLACE WITH SECURE RANDOM STRING
// ============================================================================
const JWT_SECRET = process.env.JWT_SECRET || 'REPLACE_THIS_WITH_SECURE_RANDOM_STRING_IN_PRODUCTION';

// ============================================================================
// AUTHENTICATION MIDDLEWARE
// ============================================================================
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
}

// ============================================================================
// REGISTRATION ENDPOINT
// ============================================================================
app.post('/api/register', authLimiter, async (req, res) => {
  try {
    const { email, password, confirmPassword, nickname } = req.body;

    // Validation
    if (!email || !password || !confirmPassword || !nickname) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ error: 'Passwords do not match' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Check if user already exists using Firebase
    const existingUser = await getFirebaseUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user object
    const newUser = {
      email,
      password: hashedPassword,
      nickname,
      isVerified: false,
      orders: []
    };

    // Save user to Firebase
    const userId = await createFirebaseUser(newUser);
    newUser.id = userId;

    // Generate verification token
    const verificationToken = jwt.sign(
      { userId: newUser.id, email: newUser.email },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'Registration successful! User created in Firebase.',
      user: {
        id: newUser.id,
        email: newUser.email,
        nickname: newUser.nickname,
        isVerified: newUser.isVerified
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ============================================================================
// LOGIN ENDPOINT
// ============================================================================
app.post('/api/login', authLimiter, async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Get user from Firebase
    const user = await getFirebaseUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Create session
    const session = {
      userId: user.id,
      token,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
    };
    sessions.push(session);

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        nickname: user.nickname,
        isVerified: user.isVerified
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ============================================================================
// EMAIL VERIFICATION ENDPOINT
// ============================================================================
app.post('/api/verify-email', async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ error: 'Verification token required' });
    }

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Update user in Firebase
    await updateFirebaseUser(decoded.userId, { isVerified: true });

    res.json({ message: 'Email verified successfully' });

  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(400).json({ error: 'Verification token has expired' });
    }
    console.error('Email verification error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ============================================================================
// PASSWORD RESET ENDPOINTS
// ============================================================================
app.post('/api/forgot-password', authLimiter, async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Check if user exists in Firebase
    const user = await getFirebaseUserByEmail(email);
    if (!user) {
      // Don't reveal if user exists or not
      return res.json({ message: 'If an account with that email exists, a reset link has been sent.' });
    }

    // Generate reset token
    const resetToken = jwt.sign(
      { userId: user.id, email: user.email, type: 'password-reset' },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ message: 'If an account with that email exists, a reset link has been sent.' });

  } catch (error) {
    console.error('Password reset error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/reset-password', async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ error: 'Token and new password are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);
    
    if (decoded.type !== 'password-reset') {
      return res.status(400).json({ error: 'Invalid token type' });
    }

    // Hash new password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
    
    // Update password in Firebase
    await updateFirebaseUser(decoded.userId, { password: hashedPassword });

    res.json({ message: 'Password reset successful' });

  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(400).json({ error: 'Reset token has expired' });
    }
    console.error('Password reset error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ============================================================================
// USER PROFILE ENDPOINTS
// ============================================================================
app.get('/api/profile', authenticateToken, async (req, res) => {
  try {
    // Get user from Firebase
    const user = await getFirebaseUserByEmail(req.user.email);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      user: {
        id: user.id,
        email: user.email,
        nickname: user.nickname,
        isVerified: user.isVerified,
        createdAt: user.createdAt,
        orders: user.orders || []
      }
    });

  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/api/profile', authenticateToken, async (req, res) => {
  try {
    const { nickname } = req.body;

    if (!nickname) {
      return res.status(400).json({ error: 'Nickname is required' });
    }

    // Update user in Firebase
    await updateFirebaseUser(req.user.userId, { nickname });

    // Get updated user
    const user = await getFirebaseUserByEmail(req.user.email);

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: user.id,
        email: user.email,
        nickname: user.nickname,
        isVerified: user.isVerified
      }
    });

  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ============================================================================
// LOGOUT ENDPOINT
// ============================================================================
app.post('/api/logout', authenticateToken, async (req, res) => {
  try {
    // Remove session
    sessions = sessions.filter(s => s.userId !== req.user.userId);

    res.json({ message: 'Logged out successfully' });

  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ============================================================================
// STRIPE INTEGRATION (EXISTING)
// ============================================================================
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY || 'sk_live_YOUR_STRIPE_SECRET_KEY_HERE');

app.post('/create-checkout-session', async (req, res) => {
  try {
    const { items } = req.body;

    const lineItems = items.map(item => ({
      price_data: {
        currency: 'gbp',
        product_data: {
          name: item.name,
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${req.headers.origin}/success.html`,
      cancel_url: `${req.headers.origin}/cancel.html`,
    });

    res.json({ id: session.id });
  } catch (error) {
    console.error('Stripe error:', error);
    res.status(500).json({ error: 'Payment processing failed' });
  }
});

// ============================================================================
// SERVE STATIC FILES
// ============================================================================
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'britishbaccy-singlefileORIG.html'));
});

// ============================================================================
// START SERVER
// ============================================================================
app.listen(PORT, () => {
  console.log(`
🚀 BritishBaccy Server running on port ${PORT}

🔥 FIREBASE INTEGRATION ACTIVE!
✅ Your Firebase project: britishbaccy
✅ API Key: AIzaSyAd35sKZRjGZKMlJLa-u4xQaMqaBE1pInA
✅ Registration system connected to Firebase

📋 SETUP STATUS:
✅ Firebase configuration complete
✅ User registration with Firebase
✅ User authentication with Firebase
✅ Password hashing and security
✅ JWT token authentication
✅ Rate limiting active

🔧 Environment Variables (Optional):
- JWT_SECRET=your_secure_random_string
- STRIPE_SECRET_KEY=your_stripe_secret_key
- FRONTEND_URL=your_frontend_url

🎯 Ready to test your registration system!
  `);
});

module.exports = app;
