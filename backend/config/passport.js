import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';

import './env.js';

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: `${process.env.BACKEND_URL || 'http://localhost:5000'}/api/auth/google/callback`
  },
  async (accessToken, refreshToken, profile, done) => {
    // यहाँ आफ्नो डाटाबेसमा युजर खोज्नुहोस् वा नयाँ बनाउनुहोस्
    // const user = await findOrCreateUser(profile);
    return done(null, profile);
  }
));