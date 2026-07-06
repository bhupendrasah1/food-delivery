import { pool } from '../config/db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { sendEmail } from '../utils/sendEmail.js';

// Helper function to generate a JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

const getFrontendUrl = () => process.env.FRONTEND_URL || 'http://localhost:5173';

export const handleGoogleCallback = async (req, res) => {
  try {
    const profile = req.user;

    if (!profile) {
      return res.redirect(`${getFrontendUrl()}/login?error=google_auth_failed`);
    }

    const googleId = profile.id;
    const email = profile.emails?.[0]?.value;
    const name = profile.displayName || profile.name?.givenName || 'Google User';

    if (!email) {
      return res.redirect(`${getFrontendUrl()}/login?error=google_email_missing`);
    }

    let userResult = await pool.query(
      'SELECT id, name, email, role, google_id FROM users WHERE google_id = $1 OR email = $2 LIMIT 1',
      [googleId, email]
    );

    if (userResult.rows.length === 0) {
      userResult = await pool.query(
        `INSERT INTO users (name, email, password, role, google_id)
         VALUES ($1, $2, NULL, 'user', $3)
         RETURNING id, name, email, role, google_id`,
        [name, email, googleId]
      );
    } else if (!userResult.rows[0].google_id) {
      await pool.query('UPDATE users SET google_id = $1 WHERE id = $2', [googleId, userResult.rows[0].id]);
    }

    const user = userResult.rows[0];
    const token = generateToken(user.id);

    return res.redirect(
      `${getFrontendUrl()}/auth/google/callback?token=${encodeURIComponent(token)}&role=${encodeURIComponent(user.role)}&name=${encodeURIComponent(user.name)}&email=${encodeURIComponent(user.email)}`
    );
  } catch (error) {
    console.error('Google auth callback failed:', error);
    return res.redirect(`${getFrontendUrl()}/login?error=google_auth_failed`);
  }
};


export const registerUser = async (req, res) => {
  const { name, email, password, role, mobile } = req.body; 

  try {
    const userExists = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userExists.rows.length > 0) {
      return res.status(400).json({ message: 'User already exists with this email!' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // SQL मा role र mobile थप्नुहोस्
    const newUser = await pool.query(
      'INSERT INTO users (name, email, password, role, mobile) VALUES ($1, $2, $3, $4, $5) RETURNING id, name, email, role',
      [name, email, hashedPassword, role, mobile]
    );

    const user = newUser.rows[0];

    res.status(201).json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token: generateToken(user.id),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

// @desc    Authenticate user & get token (Sign In)
// @route   POST /api/auth/login
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.status(400).json({ message: 'Invalid email or password! ' });
    }

    const user = result.rows[0];

    // 2. Compare the typed password with the hashed password in the database
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(400).json({ message: 'Invalid email or password! ' });
    }

    // 3. If correct, send back user details and token
    res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token: generateToken(user.id),
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during login' });
  }
};
// @desc    Get current logged-in user profile
// @route   GET /api/auth/me
// @access  Private (Requires Middleware)
export const getCurrentUser = async (req, res) => {
  try {
    res.json(req.user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching user profile ' });
  }
};



// @desc    Forgot Password - Send OTP to Email
// @route   POST /api/auth/forgot-password
export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    // 1. Check if user exists
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'No account found with this email! ' });
    }

    // 2. Generate a random 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Set expiry time to 15 minutes from now
    const otpExpiry = new Date(Date.now() + 15 * 60 * 1000);

    // 3. Save OTP and Expiry to PostgreSQL database
    await pool.query(
      'UPDATE users SET otp = $1, otp_expiry = $2 WHERE email = $3',
      [otp, otpExpiry, email]
    );

    // 4. Send the OTP via Email
    const message = `You requested a password reset. Your 6-digit Verification OTP is: ${otp}.\n\nThis OTP is valid for 15 minutes.`;
    
    await sendEmail({
      to: email,
      subject: 'Password Reset Verification OTP',
      text: message,
    });

    res.json({ message: 'OTP successfully sent to your email!' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to send email. Try again later. ' });
  }
}

// @desc    Reset Password using OTP
// @route   POST /api/auth/reset-password
export const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  try {
    // 1. Find user by email
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found! ' });
    }

    const user = result.rows[0];

    // 2. Verify OTP code and check if it has expired
    if (!user.otp || user.otp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP code! ' });
    }

    if (new Date() > new Date(user.otp_expiry)) {
      return res.status(400).json({ message: 'OTP has expired! Please request a new one. ' });
    }

    // 3. Hash the new password safely
    const salt = await bcrypt.genSalt(10);
    const hashedNewPassword = await bcrypt.hash(newPassword, salt);

    // 4. Update the user's password and clear out the used OTP fields
    await pool.query(
      'UPDATE users SET password = $1, otp = NULL, otp_expiry = NULL WHERE email = $2',
      [hashedNewPassword, email]
    );

    res.json({ message: 'Password reset successfully! You can now log in. ' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error resetting password ' });
  }
};
