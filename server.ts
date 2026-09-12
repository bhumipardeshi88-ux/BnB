import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { INITIAL_ADOPTION_CENTERS, VOLUNTEER_OPPORTUNITIES } from './src/data/seedData';
import { AdoptionCenter, UserProfile, VolunteerSession, AppointmentBooking, DEFAULT_GUEST_USER, DEFAULT_TEST_USER } from './src/types';

// In-memory data store for BalSetu
const usersDb = new Map<string, UserProfile>();
const centersDb: AdoptionCenter[] = JSON.parse(JSON.stringify(INITIAL_ADOPTION_CENTERS));
const appointmentsDb: AppointmentBooking[] = [];

// Seed the prototype test account (Email: abcd@gmail.com / abcd, Password: abcd)
usersDb.set('abcd@gmail.com', {
  ...DEFAULT_TEST_USER,
  email: 'abcd@gmail.com',
});
usersDb.set('abcd', {
  ...DEFAULT_TEST_USER,
  email: 'abcd@gmail.com',
});

// Seed an initial demo user so reviewers can test immediately
usersDb.set('parent@example.com', {
  id: 'usr-parent-1',
  email: 'parent@example.com',
  name: 'Priya Sharma',
  avatar: 'girl',
  referralCode: 'BAL-PRIYA9',
  credits: 0,
  verifiedHours: 0,
  completedSessionsCount: 0,
  badge: 'None',
  sessions: [],
  donations: [],
  referredCount: 0,
});

usersDb.set('volunteer@example.com', {
  id: 'usr-vol-1',
  email: 'volunteer@example.com',
  name: 'Aarav Patel',
  avatar: 'boy',
  referralCode: 'BAL-AARAV1',
  credits: 120,
  verifiedHours: 4,
  completedSessionsCount: 2,
  badge: 'Bronze',
  sessions: [
    {
      id: 'sess-seed-1',
      opportunityId: 'opp-teach',
      opportunityTitle: 'Teach a Subject',
      date: '2026-09-08',
      timeSlot: '10:00 AM - 12:00 PM',
      mode: 'Online',
      locationOrCenter: 'Virtual Classroom (BalSetu Stream)',
      topic: 'Basic Mathematics & Fun Numbers',
      status: 'Completed',
      hours: 2,
      creditsEarned: 50,
      completedAt: '2026-09-08T12:00:00Z',
    },
    {
      id: 'sess-seed-2',
      opportunityId: 'opp-arts',
      opportunityTitle: 'Art & Music Sessions',
      date: '2026-09-10',
      timeSlot: '04:00 PM - 06:00 PM',
      mode: 'In-person',
      locationOrCenter: 'Aarambh Shishu Kalyan Home, New Delhi',
      topic: 'Watercolor & Finger Painting Fun',
      status: 'Completed',
      hours: 2,
      creditsEarned: 50,
      completedAt: '2026-09-10T18:00:00Z',
    },
  ],
  donations: [
    {
      id: 'don-1',
      amount: 1200,
      cause: 'Term School Book & Uniform Kit for Primary Grade',
      date: '2026-09-05',
      transactionId: 'TXN-BS-98214',
      donorName: 'Aarav Patel',
    },
  ],
  referredCount: 1,
});

// Helper: Haversine distance in km
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

function calculateBadge(hours: number): 'None' | 'Bronze' | 'Silver' | 'Gold' {
  if (hours >= 16) return 'Gold';
  if (hours >= 6) return 'Silver';
  if (hours >= 1) return 'Bronze';
  return 'None';
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', app: 'BalSetu' });
  });

  // Auth: Login
  app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Prototype test account bypass: email "abcd@gmail.com" / "abcd" and password "abcd"
    if ((normalizedEmail === 'abcd@gmail.com' || normalizedEmail === 'abcd') && password.trim() === 'abcd') {
      let testUser = usersDb.get('abcd@gmail.com') || usersDb.get('abcd');
      if (!testUser) {
        testUser = { ...DEFAULT_TEST_USER, email: 'abcd@gmail.com' };
        usersDb.set('abcd@gmail.com', testUser);
      }
      return res.json({ success: true, user: testUser });
    }

    let user = usersDb.get(normalizedEmail);

    if (!user) {
      // Create user automatically for seamless onboarding taking under 1 minute
      const randomSuffix = Math.floor(1000 + Math.random() * 9000);
      const cleanName = normalizedEmail.split('@')[0].replace(/[^a-zA-Z]/g, '');
      const referralCode = `BAL-${(cleanName || 'SEEKER').toUpperCase().slice(0, 6)}${randomSuffix}`;

      user = {
        id: `usr-${Date.now()}`,
        email: normalizedEmail,
        name: cleanName ? cleanName.charAt(0).toUpperCase() + cleanName.slice(1) : 'Volunteer',
        avatar: 'boy',
        referralCode,
        credits: 0,
        verifiedHours: 0,
        completedSessionsCount: 0,
        badge: 'None',
        sessions: [],
        donations: [],
        referredCount: 0,
      };
      usersDb.set(normalizedEmail, user);
    }

    return res.json({ success: true, user });
  });

  // Auth: Continue as Guest (bypasses account creation for prototypes/demos)
  app.post('/api/auth/guest', (_req, res) => {
    let guest = usersDb.get(DEFAULT_GUEST_USER.email);
    if (!guest) {
      guest = { ...DEFAULT_GUEST_USER };
      usersDb.set(DEFAULT_GUEST_USER.email, guest);
    }
    return res.json({ success: true, user: guest });
  });

  // Auth: Signup
  app.post('/api/auth/signup', (req, res) => {
    const { email, password, name, avatar, referralCode } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    let initialCredits = 0;
    let referredBy: string | null = null;

    // Check referral code
    if (referralCode && typeof referralCode === 'string') {
      const trimmedRef = referralCode.trim().toUpperCase();
      for (const [_, existingUser] of usersDb.entries()) {
        if (existingUser.referralCode === trimmedRef && existingUser.email !== normalizedEmail) {
          // Bonus credits: 100 credits to both!
          existingUser.credits += 100;
          existingUser.referredCount = (existingUser.referredCount || 0) + 1;
          initialCredits = 100;
          referredBy = existingUser.email;
          break;
        }
      }
    }

    const cleanName = name?.trim() || normalizedEmail.split('@')[0].replace(/[^a-zA-Z]/g, '');
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const userReferralCode = `BAL-${(cleanName || 'KIDDO').toUpperCase().slice(0, 6)}${randomSuffix}`;

    const newUser: UserProfile = {
      id: `usr-${Date.now()}`,
      email: normalizedEmail,
      name: cleanName ? cleanName.charAt(0).toUpperCase() + cleanName.slice(1) : 'Friend of BalSetu',
      avatar: avatar === 'girl' ? 'girl' : 'boy',
      referralCode: userReferralCode,
      credits: initialCredits,
      verifiedHours: 0,
      completedSessionsCount: 0,
      badge: 'None',
      sessions: [],
      donations: [],
      referredCount: 0,
    };

    usersDb.set(normalizedEmail, newUser);
    return res.json({ success: true, user: newUser, referralRewardApplied: !!referredBy });
  });

  // Get user profile
  app.get('/api/user/:email', (req, res) => {
    const email = req.params.email?.trim().toLowerCase();
    const user = usersDb.get(email);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    return res.json(user);
  });

  // Update avatar
  app.post('/api/user/avatar', (req, res) => {
    const { email, avatar } = req.body;
    const normalizedEmail = email?.trim().toLowerCase();
    const user = usersDb.get(normalizedEmail);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    user.avatar = avatar === 'girl' ? 'girl' : 'boy';
    return res.json({ success: true, avatar: user.avatar });
  });

  // Adoption Centers listing with location & filtering
  app.get('/api/centers', (req, res) => {
    const { lat, lng, sort, language, specialNeeds, ageRange, search } = req.query;

    const userLat = lat ? parseFloat(lat as string) : 28.6139; // Default to New Delhi if location pending
    const userLng = lng ? parseFloat(lng as string) : 77.209;

    let results = centersDb.map((center) => {
      const distanceKm = calculateDistance(userLat, userLng, center.lat, center.lng);
      return {
        ...center,
        distanceKm,
      };
    });

    // Filtering by Search query
    if (search && typeof search === 'string') {
      const q = search.toLowerCase();
      results = results.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.city.toLowerCase().includes(q) ||
          c.state.toLowerCase().includes(q) ||
          c.address.toLowerCase().includes(q)
      );
    }

    // Filtering by Preferred Language
    if (language && typeof language === 'string' && language !== 'all') {
      const lq = language.toLowerCase();
      results = results.filter((c) =>
        (c.primaryLanguage && c.primaryLanguage.toLowerCase().includes(lq)) ||
        c.ageRangeBlocks.some((b) => b.preferredLanguage.toLowerCase().includes(lq))
      );
    }

    // Filtering by Special Needs
    if (specialNeeds && typeof specialNeeds === 'string' && specialNeeds !== 'all') {
      if (specialNeeds === 'none') {
        // Centers with blocks that have healthy children without special needs
        results = results.filter((c) =>
          c.ageRangeBlocks.some((b) => b.specialNeeds.toLowerCase().includes('none') && b.count > 0)
        );
      } else if (specialNeeds === 'special' || specialNeeds === 'mild_special') {
        // Centers with specialized care or mild medical support available
        results = results.filter((c) =>
          c.ageRangeBlocks.some((b) => !b.specialNeeds.toLowerCase().startsWith('none') || b.specialNeeds.includes('1 with'))
        );
      }
    }

    // Filtering by Age Range: 'Under 2', '2–5', '6–9', '10–12', '13–17', '18+'
    if (ageRange && typeof ageRange === 'string' && ageRange !== 'all') {
      results = results.filter((c) =>
        c.ageRangeBlocks.some((b) => b.range.toLowerCase() === ageRange.toLowerCase() && b.count > 0)
      );
    }

    // Sorting: sort by distance, age, or language
    if (sort === 'distance') {
      results.sort((a, b) => (a.distanceKm || 0) - (b.distanceKm || 0));
    } else if (sort === 'age') {
      // Sort by centers with younger children (highest count in 'Under 2' and '2–5')
      results.sort((a, b) => {
        const under2A = a.ageRangeBlocks.find((b) => b.range === 'Under 2')?.count || 0;
        const under2B = b.ageRangeBlocks.find((b) => b.range === 'Under 2')?.count || 0;
        if (under2B !== under2A) return under2B - under2A;

        const toddlerA = a.ageRangeBlocks.find((b) => b.range === '2–5')?.count || 0;
        const toddlerB = b.ageRangeBlocks.find((b) => b.range === '2–5')?.count || 0;
        return toddlerB - toddlerA;
      });
    } else if (sort === 'language') {
      // Sort alphabetically by primary language
      results.sort((a, b) => (a.primaryLanguage || '').localeCompare(b.primaryLanguage || ''));
    } else {
      // Default: distance
      results.sort((a, b) => (a.distanceKm || 0) - (b.distanceKm || 0));
    }

    return res.json(results);
  });

  // Book an appointment with an adoption center / orphanage for an age-range group
  app.post('/api/centers/book-appointment', (req, res) => {
    const { centerId, centerName, ageRange, parentName, phone, email, preferredDate, preferredTimeSlot, notes } = req.body;

    if (!centerId || !parentName || !phone || !email || !preferredDate) {
      return res.status(400).json({ error: 'Please provide all required contact details and a preferred date.' });
    }

    const newBooking: AppointmentBooking = {
      id: `apt-${Date.now()}`,
      centerId,
      centerName: centerName || 'Adoption Agency',
      ageRange: ageRange || 'Under 2',
      parentName: parentName.trim(),
      phone: phone.trim(),
      email: email.trim().toLowerCase(),
      preferredDate,
      preferredTimeSlot: preferredTimeSlot || 'Morning (10:00 AM - 1:00 PM)',
      notes: notes ? notes.trim() : '',
      status: 'Pending Orphanage Confirmation',
      createdAt: new Date().toISOString(),
    };

    appointmentsDb.unshift(newBooking);

    return res.json({
      success: true,
      booking: newBooking,
      message: 'Appointment booking request received. The orphanage counselor will contact you directly via phone/email to confirm your visit date and Home Study guidance.',
    });
  });

  // Retrieve appointments for a parent
  app.get('/api/appointments', (req, res) => {
    const { email } = req.query;
    if (!email || typeof email !== 'string') {
      return res.json(appointmentsDb);
    }
    const filtered = appointmentsDb.filter((a) => a.email === email.trim().toLowerCase());
    return res.json(filtered);
  });

  // Get volunteer opportunities
  app.get('/api/volunteer/opportunities', (_req, res) => {
    return res.json(VOLUNTEER_OPPORTUNITIES);
  });

  // Volunteer opportunity signup (4-5 fields max)
  app.post('/api/volunteer/signup', (req, res) => {
    const { email, opportunityId, opportunityTitle, date, timeSlot, mode, locationOrCenter, topic, customTopic } = req.body;

    const normalizedEmail = email?.trim().toLowerCase();
    const user = usersDb.get(normalizedEmail);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const newSession: VolunteerSession = {
      id: `sess-${Date.now()}`,
      opportunityId: opportunityId || 'opp-teach',
      opportunityTitle: opportunityTitle || 'Volunteering Session',
      date: date || new Date().toISOString().split('T')[0],
      timeSlot: timeSlot || '10:00 AM - 12:00 PM',
      mode: mode || 'Online',
      locationOrCenter: locationOrCenter || (mode === 'Online' ? 'BalSetu Virtual Classroom' : 'Local Community Learning Center'),
      topic: customTopic ? `Custom: ${customTopic}` : topic || 'General Education Session',
      customTopic,
      status: 'Scheduled',
      hours: 2,
      creditsEarned: 50,
    };

    user.sessions.unshift(newSession);
    return res.json({ success: true, session: newSession, user });
  });

  // Complete / Verify a volunteer session
  // This immediately logs hours, awards credits, upgrades badge, and unlocks benefits!
  app.post('/api/volunteer/complete-session', (req, res) => {
    const { email, sessionId } = req.body;
    const normalizedEmail = email?.trim().toLowerCase();
    const user = usersDb.get(normalizedEmail);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const session = user.sessions.find((s) => s.id === sessionId);
    if (session) {
      if (session.status !== 'Completed') {
        session.status = 'Completed';
        session.completedAt = new Date().toISOString();
        user.verifiedHours += session.hours || 2;
        user.credits += session.creditsEarned || 50;
        user.completedSessionsCount += 1;
        user.badge = calculateBadge(user.verifiedHours);
      }
    } else {
      // Instant self-log a session to test benefits unlock easily
      const completedSession: VolunteerSession = {
        id: `sess-${Date.now()}`,
        opportunityId: 'opp-teach',
        opportunityTitle: 'Teach a Subject',
        date: new Date().toISOString().split('T')[0],
        timeSlot: 'Morning Slot (Verified)',
        mode: 'Online',
        locationOrCenter: 'BalSetu Children Learning Center',
        topic: 'Foundational English & Reading Stories',
        status: 'Completed',
        hours: 2,
        creditsEarned: 50,
        completedAt: new Date().toISOString(),
      };
      user.sessions.unshift(completedSession);
      user.verifiedHours += 2;
      user.credits += 50;
      user.completedSessionsCount += 1;
      user.badge = calculateBadge(user.verifiedHours);
    }

    return res.json({ success: true, user });
  });

  // Quick Donation ("fund a child's education" - takes <30 seconds)
  app.post('/api/volunteer/donate', (req, res) => {
    const { email, amount, cause, donorName } = req.body;
    const numAmount = parseInt(amount, 10) || 500;
    const normalizedEmail = email?.trim().toLowerCase();
    const user = usersDb.get(normalizedEmail);

    const donation = {
      id: `don-${Date.now()}`,
      amount: numAmount,
      cause: cause || "Child's Annual Learning Books & Nutrition Kit",
      date: new Date().toISOString().split('T')[0],
      transactionId: `TXN-BS-${Math.floor(100000 + Math.random() * 900000)}`,
      donorName: donorName || (user ? user.name : 'Generous Guardian'),
    };

    if (user) {
      user.donations.unshift(donation);
      // Give gratitude donor credits
      user.credits += Math.min(100, Math.floor(numAmount / 10));
    }

    return res.json({ success: true, donation, user });
  });

  // Vite middleware setup
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`BalSetu server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
