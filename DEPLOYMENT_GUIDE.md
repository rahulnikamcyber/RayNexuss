# Complete Render Deployment Guide

## Prerequisites
- GitHub account
- Render account (free tier works)
- Git installed on your machine

## Step-by-Step Deployment

### 1. Create GitHub Repository

```bash
# Create new repository on GitHub.com
# Repository name: lead-vendor-platform
# Make it public or private (your choice)
```

### 2. Setup Local Project

```bash
# Clone your empty repository
git clone https://github.com/YOUR_USERNAME/lead-vendor-platform.git
cd lead-vendor-platform

# Create project structure
mkdir templates
```

### 3. Add All Files

Create these files in the root directory:
- `main.py`
- `requirements.txt`
- `render.yaml`
- `.env.example`
- `.gitignore`
- `README.md`

Create these files in `templates/` directory:
- `base.html`
- `index.html`
- `lead_form.html`
- `vendor_register.html`
- `login.html`
- `lead_success.html`
- `vendor_success.html`
- `admin_dashboard.html`
- `vendor_dashboard.html`

### 4. Commit and Push

```bash
git add .
git commit -m "Initial commit: Complete Lead-Vendor Platform"
git push origin main
```

### 5. Deploy on Render

#### A. Create New Blueprint

1. Login to [Render Dashboard](https://dashboard.render.com)
2. Click **"New +"** button
3. Select **"Blueprint"**
4. Click **"Connect account"** to link GitHub
5. Find and select your `lead-vendor-platform` repository
6. Click **"Connect"**

#### B. Review Configuration

Render will show:
- ✅ Web Service: `lead-vendor-platform`
- ✅ PostgreSQL Database: `lead-vendor-db`

Click **"Apply"** to start deployment.

#### C. Wait for Deployment

- Database creation: ~2 minutes
- App deployment: ~5 minutes
- Total time: ~7 minutes

### 6. Configure Environment Variables

Once deployed, click on your **web service** name:

1. Go to **"Environment"** tab
2. Click **"Add Environment Variable"**

Add these variables:

```
# Auto-generated (already set)
DATABASE_URL          ✅ (from database)
SECRET_KEY            ✅ (auto-generated)

# Add these manually if you want WhatsApp:
WHATSAPP_API_URL      = https://api.ultramsg.com/YOUR_INSTANCE/messages/chat
WHATSAPP_API_TOKEN    = YOUR_TOKEN_HERE

# Add these for email (optional):
SMTP_USER             = your-email@gmail.com
SMTP_PASSWORD         = your-app-password
```

3. Click **"Save Changes"**
4. Render will automatically redeploy

### 7. Access Your Application

Your app will be live at:
```
https://lead-vendor-platform.onrender.com
```

Or your custom name:
```
https://YOUR-APP-NAME.onrender.com
```

### 8. Test the Application

1. **Home Page**: Visit the URL
2. **Admin Login**: 
   - Go to `/login`
   - Username: `admin`
   - Password: `admin123`
3. **Submit Test Lead**: Use `/lead-form`
4. **Register Vendor**: Use `/vendor-register`

## Environment Setup Details

### WhatsApp Integration Setup

#### Option 1: UltraMsg (Easiest)

1. Go to [UltraMsg.com](https://ultramsg.com)
2. Sign up and get instance ID
3. Copy your token
4. Add to Render:
```
WHATSAPP_API_URL=https://api.ultramsg.com/instance12345/messages/chat
WHATSAPP_API_TOKEN=your_token_here
```

#### Option 2: Twilio

1. Sign up at [Twilio.com](https://twilio.com)
2. Get WhatsApp-enabled number
3. Copy Account SID and Auth Token
4. Add to Render:
```
WHATSAPP_API_URL=https://api.twilio.com/2010-04-01/Accounts/ACCOUNT_SID/Messages.json
WHATSAPP_API_TOKEN=your_auth_token
```

### Email Setup (Gmail)

1. Enable 2-Factor Authentication on Gmail
2. Generate App Password:
   - Go to Google Account Settings
   - Security → App Passwords
   - Create new app password
3. Add to Render:
```
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=generated-app-password
```

### Razorpay Setup

1. Sign up at [Razorpay.com](https://razorpay.com)
2. Get Test/Live API keys
3. Add to Render:
```
RAZORPAY_KEY_ID=rzp_test_xxxxx
RAZORPAY_KEY_SECRET=your_secret_key
```

## Monitoring & Maintenance

### View Logs

1. Go to Render Dashboard
2. Click on your service
3. Click **"Logs"** tab
4. View real-time logs

### Check Database

1. Click on **"lead-vendor-db"**
2. Click **"Connect"**
3. Use provided connection string with tools like:
   - pgAdmin
   - DBeaver
   - psql command line

### Update Code

```bash
# Make changes locally
git add .
git commit -m "Update: description of changes"
git push origin main

# Render auto-deploys on push
```

### Manual Redeploy

1. Go to web service dashboard
2. Click **"Manual Deploy"**
3. Select branch: `main`
4. Click **"Deploy"**

## Custom Domain (Optional)

1. Buy domain from Namecheap/GoDaddy
2. In Render Dashboard:
   - Go to web service
   - Click **"Settings"**
   - Scroll to **"Custom Domain"**
   - Add your domain
3. Update DNS records as shown

## Troubleshooting

### Issue: App Not Starting

**Solution:**
```bash
# Check logs for errors
# Common issues:
- Missing dependencies in requirements.txt
- Database connection failed
- Import errors
```

### Issue: Database Connection Error

**Solution:**
```bash
# Verify DATABASE_URL format:
postgresql://user:pass@host:port/dbname

# Not postgres:// (should be postgresql://)
```

### Issue: WhatsApp Not Sending

**Solution:**
```bash
# Verify API credentials
# Test endpoint with curl:
curl -X POST https://api.ultramsg.com/instance/messages/chat \
  -H "Content-Type: application/json" \
  -d '{"to":"1234567890","body":"test"}'
```

### Issue: 502 Bad Gateway

**Solution:**
```bash
# Service is starting up (wait 2-3 minutes)
# Or service crashed (check logs)
```

### Issue: Static Files Not Loading

**Solution:**
```bash
# For Tailwind CSS - we use CDN, so no issue
# For Chart.js - also CDN
# Both load from external sources
```

## Performance Optimization

### Free Tier Limitations

- App sleeps after 15 min inactivity
- First request after sleep takes ~30 seconds
- Upgrade to paid plan for always-on

### Database Backups

1. Go to database dashboard
2. Click **"Backups"** (paid feature)
3. Or manually export:
```bash
pg_dump DATABASE_URL > backup.sql
```

### Scaling

Upgrade plans in Render dashboard:
- **Starter**: $7/month (always-on)
- **Standard**: $25/month (better performance)
- **Pro**: $85/month (high traffic)

## Security Checklist

- ✅ Change admin password immediately
- ✅ Use strong SECRET_KEY
- ✅ Enable HTTPS (automatic on Render)
- ✅ Keep dependencies updated
- ✅ Use environment variables for secrets
- ✅ Enable database backups
- ✅ Monitor logs regularly

## Cost Breakdown

### Free Tier
- Web Service: Free (750 hours/month)
- PostgreSQL: Free (90 days, then $7/month)
- Total: $0 for first 90 days

### Paid (Recommended for Production)
- Web Service Starter: $7/month
- PostgreSQL: $7/month
- Total: $14/month

## Support Resources

- Render Docs: https://render.com/docs
- Render Status: https://status.render.com
- Community: https://community.render.com

## Next Steps After Deployment

1. ✅ Test all features
2. ✅ Configure WhatsApp
3. ✅ Setup payment gateway
4. ✅ Add real vendor data
5. ✅ Configure custom domain
6. ✅ Enable monitoring
7. ✅ Setup backups
8. ✅ Market to vendors

---

**Your platform is now live! 🚀**
