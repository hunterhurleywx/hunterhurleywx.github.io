const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const crypto = require('crypto');
const app = express();

// Security: Hide password in obfuscated function
const getSecureCredentials = (() => {
  const data = 'UmVwb3J0QnVkZHlBZG1pbjU3NDMyYWJqcyE=';
  return () => ({
    username: 'admin',
    password: Buffer.from(data, 'base64').toString('utf8')
  });
})();

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
app.post('/report_buddy_network/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const creds = getSecureCredentials();
    
    if (username === creds.username && password === creds.password) {
      req.session.authenticated = true;
      res.json({ success: true });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Authentication error' });
  }
});

app.post('/report_buddy_network/api/logout', (req, res) => {
  req.session.destroy();
  res.json({ success: true });
});

// Submit new report (public endpoint for Report Buddy app)
app.post('/api/reports', cors({
  origin: true, // Allow any origin for this public endpoint
  credentials: false
}), upload.single('image'), (req, res) => {
  try {
    console.log('Report submission received:', {
      type: req.body.type,
      lat: req.body.lat,
      lon: req.body.lon,
      hasImage: !!req.file
    });
    
    const report = {
      id: nextId++,
      type: req.body.type,
      lat: parseFloat(req.body.lat),
      lon: parseFloat(req.body.lon),
      timestamp: req.body.timestamp || new Date().toISOString(),
      location: req.body.location,
      details: req.body.details,
      spotter_id: req.body.spotter_id || 'Anonymous',
      confidence: parseInt(req.body.confidence) || 5,
      image_url: req.file ? `/uploads/${req.file.filename}` : null,
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
app.get('/report_buddy_network/api/reports', requireAuth, (req, res) => {
  const timeFilter = req.query.hours ? parseInt(req.query.hours) : 24;
  const cutoff = new Date(Date.now() - (timeFilter * 60 * 60 * 1000));
  
  const filtered = reports.filter(report => 
    new Date(report.submitted_at) > cutoff
  );
  
  res.json(filtered);
});

// Delete report (protected)
app.delete('/report_buddy_network/api/reports/:id', requireAuth, (req, res) => {
  const id = parseInt(req.params.id);
  const initialLength = reports.length;
  reports = reports.filter(report => report.id !== id);
  
  if (reports.length < initialLength) {
    generatePlacefile();
    res.json({ success: true, message: 'Report deleted' });
  } else {
    res.status(404).json({ error: 'Report not found' });
  }
});

// Verify report (protected)
app.patch('/report_buddy_network/api/reports/:id/verify', requireAuth, (req, res) => {
  const id = parseInt(req.params.id);
  const report = reports.find(r => r.id === id);
  if (report) {
    report.verified = true;
    generatePlacefile();
    res.json({ success: true });
  } else {
    res.status(404).json({ error: 'Report not found' });
  }
});

// Serve placefile (public)
app.get('/placefile.txt', (req, res) => {
  res.type('text/plain');
  res.sendFile(path.join(__dirname, 'public', 'placefile.txt'));
});

// Admin panel (with integrated login)
app.get('/report_buddy_network', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin_integrated.html'));
});

// Serve uploaded images (protected)
app.use('/uploads', requireAuth, express.static('uploads'));

// Generate placefile with 90-minute expiration
async function generatePlacefile() {
  try {
    const cutoff = new Date(Date.now() - (90 * 60 * 1000)); // Last 90 minutes
    const recentReports = reports.filter(report => 
      new Date(report.submitted_at) > cutoff
    );
    
    let placefile = `Title: Report Buddy
Threshold: 999
RefreshSeconds: 60
IconFile: 1, 32, 32, 16, 16, "https://hhwx.me/alert.png"
Font: 1, 11, 1, "Arial"

`;

    // Use simple ASCII symbols for maximum compatibility
    const iconMap = {
      'Tornado': { symbol: 'T', color: '255 0 0' },
      'Wall Cloud': { symbol: 'W', color: '255 128 0' },
      'Funnel Cloud': { symbol: 'F', color: '255 255 0' },
      'Hail': { symbol: 'H', color: '0 255 0' },
      'Wind': { symbol: 'G', color: '0 128 255' },
      'Flood': { symbol: 'L', color: '0 0 255' },
      'Damage': { symbol: 'D', color: '255 0 0' },
      'Snow Depth': { symbol: 'S', color: '200 200 255' }
    };

    recentReports.forEach(report => {
      const icon = iconMap[report.type] || iconMap['Damage'];
      const age = Math.round((Date.now() - new Date(report.submitted_at)) / (1000 * 60));
      
      placefile += `Object: ${report.lat}, ${report.lon}
  Icon: 0, 0, 0, 1, 1, "${report.type}: ${report.details}\\n${report.location}\\nAge: ${age}min\\nSpotter: ${report.spotter_id}${report.verified ? ' ✓' : ''}"
  Color: ${icon.color}
  Text: -17, 17, 1, "${icon.symbol}", "${report.type}"
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
  console.log(`Admin panel: http://localhost:${PORT}/report_buddy_network`);
  console.log(`Placefile: http://localhost:${PORT}/placefile.txt`);
  initialize();
});
