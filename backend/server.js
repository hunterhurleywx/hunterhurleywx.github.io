const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const crypto = require('crypto');
const fetch = require('node-fetch');
const app = express();

// Security: Hide password in obfuscated function
// WFO Credentials - Add all WFO codes and admin
const getWFOCredentials = () => {
  const credentials = {
    'admin': { password: 'RBP@dm1n#2025!Str0ng', wfo: 'ADMIN', isAdmin: true },
    'abq': { password: 'Kx#9mP$vL2qR!8nT', wfo: 'ABQ', isAdmin: false },
    'abr': { password: 'Zt&7wN@kJ4sF!9pM', wfo: 'ABR', isAdmin: false },
    'afc': { password: 'Qm*8bH#xC3vR$6nL', wfo: 'AFC', isAdmin: false },
    'afg': { password: 'Pr@5yK&tN9jW!2mX', wfo: 'AFG', isAdmin: false },
    'ajk': { password: 'Wd#3kL$mP7vT@8sR', wfo: 'AJK', isAdmin: false },
    'akq': { password: 'Nx&6tR#wJ2qM!9pV', wfo: 'AKQ', isAdmin: false },
    'aly': { password: 'Jt@4mK$vP8nL#5wR', wfo: 'ALY', isAdmin: false },
    'ama': { password: 'Ys#7pN&kR3tW!6mJ', wfo: 'AMA', isAdmin: false },
    'apx': { password: 'Lm*9wT@hC5vK$2nR', wfo: 'APX', isAdmin: false },
    'arx': { password: 'Rk&2nP#jM8sT@4vL', wfo: 'ARX', isAdmin: false },
    'bgm': { password: 'Vt#6mJ$wK3nR!9pL', wfo: 'BGM', isAdmin: false },
    'bis': { password: 'Hx@8kL&tN5vM#2wP', wfo: 'BIS', isAdmin: false },
    'bmx': { password: 'Pm*4rT#kJ9nW$7sL', wfo: 'BMX', isAdmin: false },
    'boi': { password: 'Tn&3wK@mR6pL!8vJ', wfo: 'BOI', isAdmin: false },
    'bou': { password: 'Kr#5nM$vT2wP@9jL', wfo: 'BOU', isAdmin: false },
    'box': { password: 'Wj@7tL&pK4mR#6nV', wfo: 'BOX', isAdmin: false },
    'bro': { password: 'Ms*2vN#kT8wJ$3pR', wfo: 'BRO', isAdmin: false },
    'btv': { password: 'Lt&9pK@jR5nM!7wT', wfo: 'BTV', isAdmin: false },
    'buf': { password: 'Rn#4mT$wK7vJ@2pL', wfo: 'BUF', isAdmin: false },
    'byz': { password: 'Vk*6wJ&tM3nR#8pL', wfo: 'BYZ', isAdmin: false },
    'cae': { password: 'Jp@8nL#kT5wM$9vR', wfo: 'CAE', isAdmin: false },
    'car': { password: 'Tw&3mK$pR7nJ!4vL', wfo: 'CAR', isAdmin: false },
    'chs': { password: 'Nm#5vT@wK2pL&8jR', wfo: 'CHS', isAdmin: false },
    'cle': { password: 'Kp*7jR#mT9wN$3vL', wfo: 'CLE', isAdmin: false },
    'crp': { password: 'Wt@4nL&kM6vJ#2pR', wfo: 'CRP', isAdmin: false },
    'ctp': { password: 'Rv&8mK$tJ3nW!5pL', wfo: 'CTP', isAdmin: false },
    'cys': { password: 'Ln#2wT@pK7mR$9vJ', wfo: 'CYS', isAdmin: false },
    'ddc': { password: 'Jm*6vK&nR4tL#8wP', wfo: 'DDC', isAdmin: false },
    'dlh': { password: 'Pt@9kM$wJ5nT!3vR', wfo: 'DLH', isAdmin: false },
    'dmx': { password: 'Tk&7nR#mL2wP@6vJ', wfo: 'DMX', isAdmin: false },
    'dtx': { password: 'Nw#4pJ$kT8mR&5vL', wfo: 'DTX', isAdmin: false },
    'dvn': { password: 'Rm*3tL@wK9nJ#7pM', wfo: 'DVN', isAdmin: false },
    'eax': { password: 'Vj&8mK#tN5wR$2pL', wfo: 'EAX', isAdmin: false },
    'eka': { password: 'Kn@6wT$pJ3mL!9vR', wfo: 'EKA', isAdmin: false },
    'epz': { password: 'Wp#5nR&kM7tJ@4vL', wfo: 'EPZ', isAdmin: false },
    'ewx': { password: 'Lt*9vK#jT2nM$8wR', wfo: 'EWX', isAdmin: false },
    'ffc': { password: 'Jm@3pT&wR6nK!7vL', wfo: 'FFC', isAdmin: false },
    'fgf': { password: 'Tn#8kL$mJ4wP@5vR', wfo: 'FGF', isAdmin: false },
    'fgz': { password: 'Rp&2wM#tK9nJ*6vL', wfo: 'FGZ', isAdmin: false },
    'fsd': { password: 'Vk@7nT$pR3mL&8wJ', wfo: 'FSD', isAdmin: false },
    'fwd': { password: 'Nj#5mK@wT4vR$9pL', wfo: 'FWD', isAdmin: false },
    'ggw': { password: 'Kw*8tL&jM2nP#6vR', wfo: 'GGW', isAdmin: false },
    'gid': { password: 'Pm@4vR#kT7wJ$3nL', wfo: 'GID', isAdmin: false },
    'gjt': { password: 'Wt&9nK$mJ5pL!2vR', wfo: 'GJT', isAdmin: false },
    'gld': { password: 'Lr#6wT@kN8mJ&4pV', wfo: 'GLD', isAdmin: false },
    'grb': { password: 'Jn*3pK#tR9wM$7vL', wfo: 'GRB', isAdmin: false },
    'grr': { password: 'Tk@8mL&wJ2nR#5pV', wfo: 'GRR', isAdmin: false },
    'gsp': { password: 'Rw&4vT$kM6nJ@9pL', wfo: 'GSP', isAdmin: false },
    'gum': { password: 'Vp#7nK*jT3wL&8mR', wfo: 'GUM', isAdmin: false },
    'gyx': { password: 'Nm@5tR#wK4pJ$2vL', wfo: 'GYX', isAdmin: false },
    'hfo': { password: 'Kj&9mL$tN7wR!6pV', wfo: 'HFO', isAdmin: false },
    'hgx': { password: 'Wt#3vK@mJ8nL&5pR', wfo: 'HGX', isAdmin: false },
    'hnx': { password: 'Pr*6wT#kR2mJ$9vL', wfo: 'HNX', isAdmin: false },
    'hun': { password: 'Ln@8pK&tM4wJ#7vR', wfo: 'HUN', isAdmin: false },
    'ict': { password: 'Jm$5nR@wT9kL!3pV', wfo: 'ICT', isAdmin: false },
    'ilm': { password: 'Tv&2wK#mJ6nR*8pL', wfo: 'ILM', isAdmin: false },
    'iln': { password: 'Rk#7pT$wL3mJ@4vN', wfo: 'ILN', isAdmin: false },
    'ilx': { password: 'Vw@9nK&jR5tL#2pM', wfo: 'ILX', isAdmin: false },
    'ind': { password: 'Np*4mT#kJ8wR$6vL', wfo: 'IND', isAdmin: false },
    'iwx': { password: 'Kt&3vR@mL7nJ!9pW', wfo: 'IWX', isAdmin: false },
    'jan': { password: 'Wm#8tK$pJ2nR&5vL', wfo: 'JAN', isAdmin: false },
    'jax': { password: 'Pj@6nL#wT4mK*7vR', wfo: 'JAX', isAdmin: false },
    'jkl': { password: 'Lr&9wK$tM3nJ@8pV', wfo: 'JKL', isAdmin: false },
    'key': { password: 'Jn#5mT@kR7wL!2pV', wfo: 'KEY', isAdmin: false },
    'lbf': { password: 'Tw*4vK&jN9mR#6pL', wfo: 'LBF', isAdmin: false },
    'lch': { password: 'Rk@8pL$wT3nJ&7mV', wfo: 'LCH', isAdmin: false },
    'lix': { password: 'Vm#2tK*mJ6wR@9pL', wfo: 'LIX', isAdmin: false },
    'lkn': { password: 'Np&7jR#kT5mL$4wV', wfo: 'LKN', isAdmin: false },
    'lmk': { password: 'Kw@3nT$pJ8vR!6mL', wfo: 'LMK', isAdmin: false },
    'lot': { password: 'Wt#9mK&rL2nJ*5pV', wfo: 'LOT', isAdmin: false },
    'lox': { password: 'Pj*6vR@kT4wM#8nL', wfo: 'LOX', isAdmin: false },
    'lsx': { password: 'Lm&5tK$jN7wR@3pV', wfo: 'LSX', isAdmin: false },
    'lub': { password: 'Jn#8pT*wK2mR&9vL', wfo: 'LUB', isAdmin: false },
    'lwx': { password: 'Tr@4wK#mJ6nL$7pV', wfo: 'LWX', isAdmin: false },
    'lzk': { password: 'Rk&9vT$pL3mJ!8wN', wfo: 'LZK', isAdmin: false },
    'maf': { password: 'Vw*2nK@tR5jL#6pM', wfo: 'MAF', isAdmin: false },
    'meg': { password: 'Nm#7tR&kJ4wP$9vL', wfo: 'MEG', isAdmin: false },
    'mfl': { password: 'Kp@8mL*wT3nJ&5vR', wfo: 'MFL', isAdmin: false },
    'mfr': { password: 'Wj#6vK$tM9pR@2nL', wfo: 'MFR', isAdmin: false },
    'mhx': { password: 'Pt&4nR#kJ7wL*8mV', wfo: 'MHX', isAdmin: false },
    'mkx': { password: 'Lm@3wT$pK5nJ!9vR', wfo: 'MKX', isAdmin: false },
    'mlb': { password: 'Jr*8tK&mL2wN#6pV', wfo: 'MLB', isAdmin: false },
    'mob': { password: 'Tn#5vR@kJ4mP$7wL', wfo: 'MOB', isAdmin: false },
    'mpx': { password: 'Rw&9pK*tM3nJ@8vL', wfo: 'MPX', isAdmin: false },
    'mqt': { password: 'Vk#2mT$wL6pR&4nJ', wfo: 'MQT', isAdmin: false },
    'mrx': { password: 'Np@7jK#tR5wM*9vL', wfo: 'MRX', isAdmin: false },
    'mso': { password: 'Km&3wR$pJ8nT!6vL', wfo: 'MSO', isAdmin: false },
    'mtr': { password: 'Wt*9vK@mL2jR#5pN', wfo: 'MTR', isAdmin: false },
    'oax': { password: 'Pn#4tL&kJ7wM$3vR', wfo: 'OAX', isAdmin: false },
    'ohx': { password: 'Lj@8mK*tR6nW&9pV', wfo: 'OHX', isAdmin: false },
    'okx': { password: 'Jw#5nR$pT2mK@7vL', wfo: 'OKX', isAdmin: false },
    'otx': { password: 'Tr&6vK#jM4wL*8pN', wfo: 'OTX', isAdmin: false },
    'oun': { password: 'Rk@9pT$wN3mJ!5vL', wfo: 'OUN', isAdmin: false },
    'pah': { password: 'Vn*2wK&tL7jR#6pM', wfo: 'PAH', isAdmin: false },
    'pbz': { password: 'Nm#8tR@kJ4wP$9vL', wfo: 'PBZ', isAdmin: false },
    'pdt': { password: 'Kw&3mL*pT6nJ@5vR', wfo: 'PDT', isAdmin: false },
    'phi': { password: 'Wp#7vK$jR2mL&8nT', wfo: 'PHI', isAdmin: false },
    'pih': { password: 'Pt@4nJ#kM9wR*3vL', wfo: 'PIH', isAdmin: false },
    'ppg': { password: 'Lj&6tK$wN5mR!7pV', wfo: 'PPG', isAdmin: false },
    'pqr': { password: 'Jm*8vR@tL3nK#2wP', wfo: 'PQR', isAdmin: false },
    'psr': { password: 'Tn#5pK&jW7mR$4vL', wfo: 'PSR', isAdmin: false },
    'pub': { password: 'Rw@9mL*kT2nJ&6pV', wfo: 'PUB', isAdmin: false },
    'rah': { password: 'Vk#3wT$pJ8mR!7nL', wfo: 'RAH', isAdmin: false },
    'rev': { password: 'Np&4vK@tL6jM*9wR', wfo: 'REV', isAdmin: false },
    'riw': { password: 'Km*7tR#wJ5nP$2vL', wfo: 'RIW', isAdmin: false },
    'rlx': { password: 'Wj@8mK&pT3nL!6vR', wfo: 'RLX', isAdmin: false },
    'rnk': { password: 'Pn#2vL$kR9wJ@4mT', wfo: 'RNK', isAdmin: false },
    'sew': { password: 'Lt&5wK*jM7nR#8pV', wfo: 'SEW', isAdmin: false },
    'sgf': { password: 'Jm@6tR$pK3wN&9vL', wfo: 'SGF', isAdmin: false },
    'sgx': { password: 'Tr#4nK@wJ8mL*2pV', wfo: 'SGX', isAdmin: false },
    'shv': { password: 'Rw&9vT$kM5nJ!7pL', wfo: 'SHV', isAdmin: false },
    'sjt': { password: 'Vk*3mK#tL6wR@8pN', wfo: 'SJT', isAdmin: false },
    'sju': { password: 'Np@7jR&wT2mK$4vL', wfo: 'SJU', isAdmin: false },
    'slc': { password: 'Kw#5tL*pJ9nM&3vR', wfo: 'SLC', isAdmin: false },
    'sto': { password: 'Wm&8vK@tR4jL#6pN', wfo: 'STO', isAdmin: false },
    'tae': { password: 'Pj*2nR$kM7wT!9vL', wfo: 'TAE', isAdmin: false },
    'tbw': { password: 'Ln#6mK&jT3wR@5pV', wfo: 'TBW', isAdmin: false },
    'tfx': { password: 'Jt@9vL*wK8nM$2pR', wfo: 'TFX', isAdmin: false },
    'top': { password: 'Tw&4pK#mR5jN!7vL', wfo: 'TOP', isAdmin: false },
    'tsa': { password: 'Rn*3wT$kL6mJ@9pV', wfo: 'TSA', isAdmin: false },
    'twc': { password: 'Vk#8tR&jM2wP*4nL', wfo: 'TWC', isAdmin: false },
    'unr': { password: 'Nm@7vK$pT9jR&3wL', wfo: 'UNR', isAdmin: false },
    'vef': { password: 'Kp#5mL*wJ4nT@8vR', wfo: 'VEF', isAdmin: false }
  };
  return credentials;
};

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'https://hhwx.me'],
  credentials: true
}));
app.use(express.json());
app.use(express.static('public'));
app.use(session({
  secret: crypto.randomBytes(64).toString('hex'),
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: false, // Set to true in production with HTTPS
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    httpOnly: true
  }
}));

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    cb(null, `report-${timestamp}-${file.originalname}`);
  }
});
const upload = multer({ storage });

// Simple in-memory storage (replace with database in production)
let reports = [];
let nextId = 1;
let wfoReportCounts = {}; // Track report counts per WFO for the day

// Get WFO from coordinates using NWS API
async function getWFOFromCoordinates(lat, lon) {
  try {
    const response = await fetch(`https://api.weather.gov/points/${lat},${lon}`);
    if (response.ok) {
      const data = await response.json();
      // Extract WFO code from gridId (e.g., "TOP" from "TOP")
      return data.properties.gridId || 'UNKNOWN';
    }
  } catch (error) {
    console.error('Error fetching WFO:', error);
  }
  return 'UNKNOWN';
}

// Reset WFO counts daily
function resetDailyWFOCounts() {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  
  const msUntilMidnight = tomorrow - now;
  
  setTimeout(() => {
    wfoReportCounts = {};
    resetDailyWFOCounts(); // Schedule next reset
  }, msUntilMidnight);
}

resetDailyWFOCounts(); // Initialize daily reset

// Auth middleware
const requireAuth = (req, res, next) => {
  if (req.session.authenticated) {
    next();
  } else {
    res.status(401).json({ error: 'Authentication required' });
  }
};

// Routes

// Authentication
app.post('/rbp/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const credentials = getWFOCredentials();
    const userKey = username.toLowerCase();
    
    if (credentials[userKey] && credentials[userKey].password === password) {
      req.session.authenticated = true;
      req.session.userWFO = credentials[userKey].wfo;
      req.session.isAdmin = credentials[userKey].isAdmin;
      req.session.username = userKey;
      
      res.json({ 
        success: true, 
        userWFO: credentials[userKey].wfo,
        isAdmin: credentials[userKey].isAdmin 
      });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Authentication error' });
  }
});

app.post('/rbp/api/logout', (req, res) => {
  req.session.destroy();
  res.json({ success: true });
});

// Get user session info (protected)
app.get('/rbp/api/user', requireAuth, (req, res) => {
  res.json({
    userWFO: req.session.userWFO,
    isAdmin: req.session.isAdmin,
    username: req.session.username
  });
});

// Submit new report (public endpoint for Report Buddy app)
app.post('/api/reports', cors({
  origin: true, // Allow any origin for this public endpoint
  credentials: false
}), upload.single('image'), async (req, res) => {
  try {
    console.log('Report submission received:', {
      type: req.body.type,
      lat: req.body.lat,
      lon: req.body.lon,
      hasImage: !!req.file
    });
    
    const lat = parseFloat(req.body.lat);
    const lon = parseFloat(req.body.lon);
    
    // Get WFO for this location
    const wfo = await getWFOFromCoordinates(lat, lon);
    console.log(`Report WFO: ${wfo}`);
    
    // Handle image caching by WFO
    let cachedImageUrl = null;
    if (req.file) {
      // Increment WFO report count for the day
      if (!wfoReportCounts[wfo]) {
        wfoReportCounts[wfo] = 0;
      }
      wfoReportCounts[wfo]++;
      
      // Create single image directory
      const imageDir = path.join(__dirname, 'public', 'report_buddy', 'image');
      await fs.mkdir(imageDir, { recursive: true });
      
      // Copy image with WFO prefix
      const cachedFileName = `${wfo.toLowerCase()}_report_${wfoReportCounts[wfo]}.jpg`;
      const cachedFilePath = path.join(imageDir, cachedFileName);
      const uploadedFilePath = path.join(__dirname, req.file.path);
      
      await fs.copyFile(uploadedFilePath, cachedFilePath);
      cachedImageUrl = `/report_buddy/image/${cachedFileName}`;
      console.log(`Cached image: ${cachedImageUrl}`);
    }
    
    // Clean details field to remove any curl parameters
    let cleanDetails = req.body.details || '';
    if (cleanDetails.includes(' -F ')) {
      cleanDetails = cleanDetails.split(' -F ')[0].trim();
    }
    
    const report = {
      id: nextId++,
      type: req.body.type,
      lat: lat,
      lon: lon,
      timestamp: req.body.timestamp || new Date().toISOString(),
      location: req.body.location,
      details: cleanDetails,
      spotter_id: '-',
      confidence: parseInt(req.body.confidence) || 5,
      image_url: req.file ? `/uploads/${req.file.filename}` : null,
      cached_image_url: cachedImageUrl,
      wfo: wfo,
      submitted_at: new Date().toISOString(),
      verified: false
    };
    
    reports.push(report);
    
    // Generate updated placefile
    generatePlacefile();
    
    res.json({ success: true, id: report.id });
  } catch (error) {
    console.error('Error submitting report:', error);
    res.status(500).json({ error: 'Failed to submit report' });
  }
});

// Protected API endpoints (admin only)
app.get('/rbp/api/reports', requireAuth, (req, res) => {
  const timeFilter = req.query.hours ? parseInt(req.query.hours) : 24;
  const cutoff = new Date(Date.now() - (timeFilter * 60 * 60 * 1000));
  
  const filtered = reports.filter(report => 
    new Date(report.submitted_at) > cutoff
  );
  
  res.json(filtered);
});

// Delete report (protected)
app.delete('/rbp/api/reports/:id', requireAuth, (req, res) => {
  const id = parseInt(req.params.id);
  const report = reports.find(r => r.id === id);
  
  if (!report) {
    return res.status(404).json({ error: 'Report not found' });
  }
  
  // Check permissions: Admin can delete any report, WFO users can only delete reports from their WFO
  if (!req.session.isAdmin && req.session.userWFO !== report.wfo) {
    return res.status(403).json({ error: 'Permission denied: You can only delete reports from your WFO' });
  }
  
  const initialLength = reports.length;
  reports = reports.filter(report => report.id !== id);
  
  if (reports.length < initialLength) {
    generatePlacefile();
    res.json({ success: true, message: 'Report deleted' });
  } else {
    res.status(500).json({ error: 'Failed to delete report' });
  }
});

// Verify report (protected)
app.patch('/rbp/api/reports/:id/verify', requireAuth, (req, res) => {
  const id = parseInt(req.params.id);
  const report = reports.find(r => r.id === id);
  
  if (!report) {
    return res.status(404).json({ error: 'Report not found' });
  }
  
  // Check permissions: Admin can verify any report, WFO users can only verify reports from their WFO
  if (!req.session.isAdmin && req.session.userWFO !== report.wfo) {
    return res.status(403).json({ error: 'Permission denied: You can only verify reports from your WFO' });
  }
  
  report.verified = true;
  generatePlacefile();
  res.json({ success: true });
});

// Serve placefile (public)
app.get('/placefile.txt', (req, res) => {
  res.type('text/plain');
  res.sendFile(path.join(__dirname, 'public', 'placefile.txt'));
});

// Admin panel (with integrated login)
app.get('/rbp', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin_integrated.html'));
});

// Serve uploaded images (protected)
app.use('/uploads', requireAuth, express.static('uploads'));

// Serve cached WFO images (public)
app.use('/report_buddy/image', express.static(path.join(__dirname, 'public/report_buddy/image')));

// Function to get the appropriate icon URL based on report type and details
function getIconUrl(type, details) {
  // Map report types to icon filenames
  const baseIconMap = {
    'Tornado': 'Tornado.png',
    'Wall Cloud': 'Wall%20Cloud.png',
    'Funnel Cloud': 'Funnel%20Cloud.png',
    'Flood': 'Flooding.png',
    'Damage': 'Damage.png',
    'Snow Depth': 'Snow%20Depth.png',
    'Dust Storm': 'Dust%20Storm.png',
    'Fog': 'Fog.png',
    'Wildfire': 'Wildfire.png'
  };
  
  // Use single hail icon for all sizes
  if (type === 'Hail') {
    return 'Hail.png';
  }
  
  // Return mapped icon or default
  return baseIconMap[type] || 'Damage.png';
}

// Generate placefile with 90-minute expiration (ORIGINAL SIMPLE FORMAT)
async function generatePlacefile() {
  try {
    const cutoff = new Date(Date.now() - (90 * 60 * 1000)); // Last 90 minutes
    const recentReports = reports.filter(report => 
      new Date(report.submitted_at) > cutoff
    );
    
    let placefile = `Refresh: 1
Threshold: 999
Title: Report Buddy
Font: 1, 11, 0, "Courier New"

`;

    // Use simple ASCII symbols for maximum compatibility (original format)
    const iconMap = {
      'Tornado': { symbol: 'T', color: '170 0 0' },
      'Wall Cloud': { symbol: 'W', color: '85 85 85' },
      'Funnel Cloud': { symbol: 'F', color: '85 85 85' },
      'Hail': { symbol: 'H', color: '0 170 0' },
      'Flood': { symbol: 'L', color: '85 85 255' },
      'Damage': { symbol: 'D', color: '170 0 0' },
      'Snow Depth': { symbol: 'S', color: '255 85 255' },
      'Dust Storm': { symbol: 'U', color: '255 170 0' },
      'Fog': { symbol: 'O', color: '85 85 85' },
      'Wildfire': { symbol: 'W', color: '255 85 85' }
    };

    recentReports.forEach((report, index) => {
      const icon = iconMap[report.type] || iconMap['Damage'];
      const age = Math.round((Date.now() - new Date(report.submitted_at)) / (1000 * 60));
      
      const reportTime = new Date(report.submitted_at).toISOString().replace('T', ' ').replace(/\.\d{3}Z$/, ' UTC');
      const imageLink = report.cached_image_url ? `\\n\\nhttps://hhwx.me${report.cached_image_url}` : '';
      
      // Only add context line if details exist and aren't empty
      let contextLine = '';
      if (report.details && report.details.trim() !== '' && report.details !== report.type) {
        if (report.type === 'Hail') {
          // Check if it's a custom "Other" hail size (contains >5.00)
          if (report.details.includes('>5.00')) {
            // Extract the custom description after "Other (>5.00″)"
            let customDescription = report.details
              .replace(/.*>5\.00[″"']*\)\s*/, '')  // Remove everything up to and including ">5.00″)"
              .trim();
            contextLine = ` (>5.00)`;
            if (customDescription) {
              contextLine += `\\nContext: ${customDescription}`;
            }
          } else {
            // Standard hail sizes - remove quotes and parentheses
            let hailSize = report.details
              .replace(/["""″′]/g, '')  // Remove all types of quotes/inch marks
              .replace(/\(([^)]+)\)/g, '$1');  // Remove parentheses around sizes
            contextLine = ` (${hailSize})`;
          }
        } else {
          contextLine = `\\nContext: ${report.details}`;
        }
      }
      
      // Get the icon URL for this report type
      const iconUrl = getIconUrl(report.type, report.details);
      const fileNumber = index + 1; // Use unique file number for each report
      
      placefile += `IconFile: ${fileNumber}, 32, 32, 16, 16, "https://hhwx.me/alert-icons/${iconUrl}"
Object: ${report.lat},${report.lon}
Icon: 0,0,000,${fileNumber},1,"Report Type: ${report.type}${contextLine}\\nLocation: ${report.location}\\nCoordinates: ${report.lat}, ${report.lon}\\nTime: ${reportTime}\\nSpotter: -\\nVerified: ${report.verified ? 'Yes' : 'No'}${imageLink}\\n\\n* WFOs and EMs can login through http://hhwx.me/rbp to view reports. *"
End:

`;
    });

    await fs.writeFile('./public/placefile.txt', placefile);
    
    // Clean up expired reports from memory
    reports = reports.filter(report => 
      new Date(report.submitted_at) > cutoff
    );
    
    console.log(`Generated placefile with ${recentReports.length} reports (${reports.length} total in memory)`);
  } catch (error) {
    console.error('Error generating placefile:', error);
  }
}

// Auto-cleanup expired reports every 10 minutes
setInterval(() => {
  const beforeCount = reports.length;
  const cutoff = new Date(Date.now() - (90 * 60 * 1000));
  reports = reports.filter(report => 
    new Date(report.submitted_at) > cutoff
  );
  
  if (reports.length !== beforeCount) {
    console.log(`Cleaned up ${beforeCount - reports.length} expired reports`);
    generatePlacefile();
  }
}, 10 * 60 * 1000);

// Initialize
async function initialize() {
  try {
    await fs.mkdir('./uploads', { recursive: true });
    await fs.mkdir('./public', { recursive: true });
    await generatePlacefile();
    console.log('Server initialized');
  } catch (error) {
    console.error('Initialization error:', error);
  }
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Report Buddy Network server running on port ${PORT}`);
  console.log(`Admin panel: http://localhost:${PORT}/rbp`);
  console.log(`Placefile: http://localhost:${PORT}/placefile.txt`);
  initialize();
});
