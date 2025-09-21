# Report Buddy Network Backend

## Overview
Backend API and placefile generation system for Report Buddy Network - integrating storm reports with GR2Analyst radar software.

## Features
- RESTful API for report submission
- Real-time placefile generation for GR2Analyst
- Password-protected admin interface
- Report verification and management
- Image upload support
- Automatic report aging and cleanup

## Quick Start

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Configure Environment
Create a `.env` file:
```env
NODE_ENV=production
PORT=3000
SESSION_SECRET=your-secure-session-secret-here
ADMIN_USERNAME=admin
ADMIN_PASSWORD=changeme123
DATABASE_URL=postgresql://user:pass@localhost:5432/reportbuddy
```

### 3. Database Setup (Optional - for production)
For production, set up PostgreSQL:
```bash
psql -U postgres -d reportbuddy -f database_schema.sql
```

For development, the app uses in-memory storage.

### 4. Start Server
```bash
# Development
npm run dev

# Production
npm start
```

## API Endpoints

### Public Endpoints
- `POST /api/reports` - Submit new report
- `GET /placefile.txt` - GR2Analyst placefile

### Protected Endpoints (Admin)
- `POST /api/login` - Admin login
- `POST /api/logout` - Admin logout
- `GET /api/reports` - List reports
- `DELETE /api/reports/:id` - Delete report
- `PATCH /api/reports/:id/verify` - Verify report

## GR2Analyst Integration

### Adding Placefile to GR2Analyst:
1. Open GR2Analyst
2. Go to `Placefiles` menu
3. Click `Add Placefile`
4. Enter URL: `https://hhwx.me/placefile.txt`
5. Set refresh interval to 60 seconds

### Placefile Features:
- Color-coded report types
- Hoverable tooltips with full details
- Age indicators
- Verification status
- Auto-refreshes every 60 seconds

## Report Types & Icons
- **Tornado** (T) - Red
- **Wall Cloud** (W) - Orange  
- **Funnel Cloud** (F) - Yellow
- **Hail** (H) - Green
- **Wind** (G) - Blue
- **Flood** (L) - Navy
- **Damage** (D) - Purple
- **Snow Depth** (S) - Light Blue

## Admin Interface
Access at `/report_buddy_network` (password protected)

Features:
- Real-time report monitoring
- Verification controls
- Time-based filtering
- Statistics dashboard
- Report deletion
- Spotter activity tracking

## Security
- Session-based authentication
- CORS protection
- Input validation
- File upload restrictions
- Rate limiting (recommended for production)

## Deployment to hhwx.me

### 1. Upload Files
```bash
# Upload backend files to your server
scp -r backend/* user@hhwx.me:/path/to/app/
```

### 2. Install Dependencies
```bash
ssh user@hhwx.me
cd /path/to/app
npm install --production
```

### 3. Configure Reverse Proxy (Nginx)
```nginx
location /api/ {
    proxy_pass http://localhost:3000/api/;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
}

location /report_buddy_network {
    proxy_pass http://localhost:3000/report_buddy_network;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
}

location /placefile.txt {
    proxy_pass http://localhost:3000/placefile.txt;
    add_header Access-Control-Allow-Origin *;
}
```

### 4. Start with PM2
```bash
npm install -g pm2
pm2 start server.js --name "report-buddy-network"
pm2 save
pm2 startup
```

## Configuration Options
- Report retention time (default: 6 hours in placefile)
- Admin credentials
- File upload limits
- CORS origins
- Session settings

## Future Enhancements
- Spotter registration system
- Email notifications for admins
- Report quality scoring
- Mobile app integration
- Integration with other radar software
- Real-time WebSocket updates
- Weather station integration

## Troubleshooting
- Check server logs: `pm2 logs report-buddy-network`
- Verify placefile format: Visit `/placefile.txt` directly
- Test API: Use curl or Postman for endpoints
- Check file permissions for uploads directory

## License
MIT License - See LICENSE file for details