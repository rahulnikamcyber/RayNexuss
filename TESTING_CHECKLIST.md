# Testing Checklist

## Pre-Deployment Tests (Local)

### Environment Setup
- [ ] All files created in correct locations
- [ ] `templates/` folder contains all 9 HTML files
- [ ] `.env` file configured with test values
- [ ] `requirements.txt` has all dependencies

### Local Testing (Optional)
```bash
# Install dependencies
pip install -r requirements.txt

# Run locally
uvicorn main:app --reload --port 8000
```

- [ ] Server starts without errors
- [ ] Home page loads at `http://localhost:8000`
- [ ] No import errors in console

## Post-Deployment Tests (Render)

### Basic Functionality

#### 1. Home Page
- [ ] Visit: `https://your-app.onrender.com/`
- [ ] Page loads without errors
- [ ] Navigation links work
- [ ] Tailwind CSS styles applied
- [ ] All 3 action cards visible

#### 2. Lead Submission Form
- [ ] Visit: `/lead-form`
- [ ] Form displays correctly
- [ ] All fields present:
  - [ ] Full Name
  - [ ] Mobile Number
  - [ ] City (dropdown)
  - [ ] Service Type (dropdown)
  - [ ] Budget
  - [ ] Notes
- [ ] Submit form with valid data
- [ ] Success page displays
- [ ] System Lead ID shown
- [ ] Check format: `LD-SERVICE-CITY-DDYYYYMM-SEQ`

#### 3. Vendor Registration
- [ ] Visit: `/vendor-register`
- [ ] Form displays correctly
- [ ] All fields present:
  - [ ] Company Name
  - [ ] Owner Name
  - [ ] Mobile
  - [ ] Email
  - [ ] City
  - [ ] Service Type
  - [ ] Password
- [ ] Submit registration
- [ ] Success page displays
- [ ] Vendor ID shown
- [ ] Check format: `VD-SERVICE-CITY-SEQ`

#### 4. Login System
- [ ] Visit: `/login`
- [ ] Form displays correctly
- [ ] Test Admin Login:
  - [ ] User Type: Admin
  - [ ] Username: `admin`
  - [ ] Password: `admin123`
  - [ ] Redirects to `/admin/dashboard`
- [ ] Test Vendor Login:
  - [ ] User Type: Vendor
  - [ ] Use email from registration
  - [ ] Use password from registration
  - [ ] Redirects to `/vendor/dashboard`
- [ ] Test Invalid Credentials:
  - [ ] Shows error message
  - [ ] Doesn't crash

#### 5. Admin Dashboard
- [ ] Visit: `/admin/dashboard` (must be logged in as admin)
- [ ] Dashboard loads
- [ ] Stats cards display:
  - [ ] Leads Today
  - [ ] Leads This Week
  - [ ] Leads This Month
  - [ ] Duplicate Leads
  - [ ] Active Vendors
  - [ ] Total Revenue
- [ ] Recent Leads table shows data
- [ ] Vendor Management table shows vendors
- [ ] Logout button works

#### 6. Vendor Dashboard
- [ ] Visit: `/vendor/dashboard` (must be logged in as vendor)
- [ ] Dashboard loads
- [ ] Stats cards display:
  - [ ] Remaining Credits (should be 0)
  - [ ] Leads Today
  - [ ] Total Leads Received
- [ ] Account status shows "Inactive - No Credits"
- [ ] Leads table shows (empty or received leads)
- [ ] Logout button works

## Database Tests

### Check Data Persistence
- [ ] Submit 2-3 test leads
- [ ] Register 2-3 test vendors
- [ ] Refresh admin dashboard
- [ ] Verify all data persists
- [ ] Check lead count increases

### Duplicate Detection
- [ ] Submit lead with Name: "John Doe", Mobile: "9876543210"
- [ ] Submit same lead again (same name and mobile)
- [ ] Second lead should be marked as duplicate
- [ ] Admin dashboard should show duplicate count increased
- [ ] Duplicate lead should NOT be sent to vendors

### Lead ID Generation
Test multiple leads on same day:
- [ ] Lead 1: `LD-SOLAR-MUMBAI-29202512-001`
- [ ] Lead 2: `LD-SOLAR-MUMBAI-29202512-002`
- [ ] Lead 3: `LD-PLUMBING-DELHI-29202512-001`
- [ ] Sequence increments correctly per service/city

### Vendor ID Generation
Test multiple vendors:
- [ ] Vendor 1: `VD-SOLAR-MUMBAI-001`
- [ ] Vendor 2: `VD-SOLAR-MUMBAI-002`
- [ ] Vendor 3: `VD-PLUMBING-DELHI-001`
- [ ] Sequence increments correctly per service/city

## Lead Routing Tests

### Setup Test Scenario
1. Create 2 vendors:
   - Vendor A: City=MUMBAI, Service=SOLAR, Credits=5, Active=true
   - Vendor B: City=MUMBAI, Service=SOLAR, Credits=0, Active=false

2. Submit lead:
   - City: MUMBAI
   - Service: SOLAR

### Expected Results
- [ ] Lead assigned to Vendor A only (has credits)
- [ ] Lead NOT assigned to Vendor B (no credits)
- [ ] Vendor A credits reduced from 5 to 4
- [ ] Assignment shows vendor_lead_number = 1 for Vendor A

### Test Credit Depletion
1. Give vendor 1 credit
2. Submit 2 matching leads
3. Expected:
   - [ ] First lead assigned, credits: 1 → 0
   - [ ] Vendor becomes inactive
   - [ ] Second lead NOT assigned to this vendor

## Authentication Tests

### JWT Token Tests
- [ ] Login creates token cookie
- [ ] Cookie is httpOnly (check browser dev tools)
- [ ] Token persists across page refreshes
- [ ] Logout clears token
- [ ] Cannot access protected routes after logout
- [ ] Expired token redirects to login

### Authorization Tests
- [ ] Admin cannot access `/vendor/dashboard` (403 error)
- [ ] Vendor cannot access `/admin/dashboard` (403 error)
- [ ] Unauthenticated user redirected to login

## Integration Tests

### WhatsApp Integration (if configured)
- [ ] Submit lead with matching vendor
- [ ] Check `whatsapp_sent` in database
- [ ] Verify vendor receives WhatsApp message
- [ ] Message contains:
  - [ ] Vendor Lead #
  - [ ] Customer name
  - [ ] City
  - [ ] Budget

### Email Fallback (if configured)
- [ ] Configure invalid WhatsApp credentials
- [ ] Submit lead
- [ ] WhatsApp fails
- [ ] Email should be sent instead
- [ ] Check `email_sent` in database

## Performance Tests

### Response Times
- [ ] Home page: < 2 seconds
- [ ] Form submission: < 3 seconds
- [ ] Dashboard load: < 3 seconds
- [ ] Lead routing: < 5 seconds

### Database Queries
- [ ] No N+1 query problems
- [ ] Dashboard loads efficiently with 100+ leads
- [ ] Pagination works (if implemented)

## Security Tests

### Password Security
- [ ] Passwords stored as bcrypt hashes
- [ ] Raw passwords never stored
- [ ] Cannot login with hash directly

### SQL Injection
Try these in forms (should NOT work):
- [ ] `' OR '1'='1` in username
- [ ] `'; DROP TABLE vendors; --` in any field
- [ ] SQLAlchemy ORM prevents injection

### XSS Prevention
Try these in lead notes:
- [ ] `<script>alert('XSS')</script>`
- [ ] Should display as text, not execute
- [ ] Jinja2 auto-escapes HTML

## Error Handling Tests

### Invalid Form Data
- [ ] Empty required fields → validation error
- [ ] Invalid email format → validation error
- [ ] Invalid mobile (not 10 digits) → validation error
- [ ] Budget < 1000 → validation error (if implemented)

### Database Errors
- [ ] Disconnect database (in Render dashboard)
- [ ] Try submitting lead
- [ ] Should show error message, not crash

### Route Protection
- [ ] Visit `/admin/dashboard` without login → redirect to login
- [ ] Visit `/vendor/dashboard` without login → redirect to login
- [ ] Visit non-existent route → 404 page

## Browser Compatibility

### Desktop Browsers
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

### Mobile Browsers
- [ ] Chrome Mobile
- [ ] Safari iOS
- [ ] Responsive design works on mobile

## Render-Specific Tests

### Environment Variables
- [ ] DATABASE_URL set correctly
- [ ] SECRET_KEY auto-generated
- [ ] Custom variables accessible in app

### Auto-Deployment
- [ ] Push changes to GitHub
- [ ] Render auto-deploys
- [ ] Check deployment logs
- [ ] New version live within 5 minutes

### Database Connection
- [ ] App connects to PostgreSQL
- [ ] Data persists after app restart
- [ ] Connection pooling works

### Logs
- [ ] View logs in Render dashboard
- [ ] No critical errors
- [ ] Info logs show activity

## Production Readiness Checklist

### Security
- [ ] Change default admin password
- [ ] Use strong SECRET_KEY
- [ ] HTTPS enabled (automatic on Render)
- [ ] Environment variables not in code
- [ ] .env file in .gitignore

### Performance
- [ ] Database indexed on frequently queried fields
- [ ] No memory leaks
- [ ] App doesn't crash under load

### Monitoring
- [ ] Check logs daily
- [ ] Monitor database size
- [ ] Track error rates
- [ ] Set up alerts (if needed)

### Backup
- [ ] Database backup enabled (paid feature)
- [ ] Manual export tested
- [ ] Recovery procedure documented

### Documentation
- [ ] README complete
- [ ] Deployment guide accurate
- [ ] API endpoints documented
- [ ] Environment variables listed

## Load Testing (Optional)

### Simulate Traffic
```bash
# Using Apache Bench
ab -n 100 -c 10 https://your-app.onrender.com/

# Using Python requests
# Submit 50 leads in parallel
```

- [ ] App handles concurrent requests
- [ ] Database doesn't deadlock
- [ ] Response times acceptable

## Final Pre-Launch Checklist

- [ ] All tests passed
- [ ] No critical bugs
- [ ] Documentation complete
- [ ] Admin password changed
- [ ] Monitoring enabled
- [ ] Backup configured
- [ ] Custom domain set (optional)
- [ ] SSL certificate active
- [ ] Payment gateway tested (if live)
- [ ] WhatsApp integration tested
- [ ] Email notifications working

---

## Issue Reporting Template

When reporting issues, include:

```
**Issue:** Brief description

**Steps to Reproduce:**
1. Step one
2. Step two
3. Step three

**Expected Result:** What should happen

**Actual Result:** What actually happened

**Environment:**
- URL: your-app.onrender.com
- Browser: Chrome 120
- Date/Time: 2024-12-29 10:30 AM

**Screenshots:** (if applicable)

**Logs:** (from Render dashboard)
```

---

**✅ Complete all tests before going live with real customers!**
