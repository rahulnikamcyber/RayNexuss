# Project Folder Structure

## Complete Directory Layout

```
lead-vendor-platform/
│
├── main.py                      # FastAPI application (core backend)
│   ├── Database Models
│   │   ├── Vendor
│   │   ├── Lead
│   │   ├── LeadAssignment
│   │   ├── Payment
│   │   └── Admin
│   │
│   ├── Routes
│   │   ├── / (home)
│   │   ├── /lead-form (GET, POST)
│   │   ├── /vendor-register (GET, POST)
│   │   ├── /login (GET, POST)
│   │   ├── /admin/dashboard
│   │   ├── /vendor/dashboard
│   │   └── /logout
│   │
│   └── Functions
│       ├── generate_system_lead_id()
│       ├── generate_vendor_id()
│       ├── send_whatsapp()
│       ├── send_email()
│       └── get_current_user()
│
├── requirements.txt             # Python dependencies
│   ├── fastapi
│   ├── uvicorn
│   ├── sqlalchemy
│   ├── psycopg2-binary
│   ├── python-jose
│   ├── passlib
│   └── others...
│
├── render.yaml                  # Render deployment config
│   ├── Web Service config
│   └── Database config
│
├── .env.example                 # Environment variables template
│   ├── DATABASE_URL
│   ├── SECRET_KEY
│   ├── WHATSAPP_API_URL
│   └── RAZORPAY_KEY_ID
│
├── .gitignore                   # Git ignore rules
│
├── README.md                    # Project documentation
│
├── DEPLOYMENT_GUIDE.md          # Step-by-step deployment
│
└── templates/                   # HTML Templates (Jinja2)
    │
    ├── base.html               # Base template (navbar, footer)
    │
    ├── index.html              # Home page
    │   └── Features:
    │       ├── 3 main action cards
    │       └── How it works section
    │
    ├── lead_form.html          # Customer lead submission
    │   └── Fields:
    │       ├── Full Name
    │       ├── Mobile
    │       ├── City (dropdown)
    │       ├── Service Type (dropdown)
    │       ├── Budget
    │       └── Notes
    │
    ├── vendor_register.html    # Vendor registration
    │   └── Fields:
    │       ├── Company Name
    │       ├── Owner Name
    │       ├── Mobile
    │       ├── Email
    │       ├── City
    │       ├── Service Type
    │       └── Password
    │
    ├── login.html              # Login page
    │   └── Fields:
    │       ├── User Type (Vendor/Admin)
    │       ├── Username/Email
    │       └── Password
    │
    ├── lead_success.html       # Lead submission confirmation
    │   └── Shows: System Lead ID
    │
    ├── vendor_success.html     # Registration confirmation
    │   └── Shows: Vendor ID
    │
    ├── admin_dashboard.html    # Admin control panel
    │   └── Sections:
    │       ├── Stats Cards (6 metrics)
    │       ├── Recent Leads Table
    │       └── Vendor Management Table
    │
    └── vendor_dashboard.html   # Vendor portal
        └── Sections:
            ├── Stats Cards (3 metrics)
            ├── Account Status
            ├── Leads Received Table
            └── Payment Section
```

## File Sizes (Approximate)

```
main.py              ~15 KB   (450 lines)
requirements.txt     ~500 B   (12 lines)
render.yaml          ~800 B   (30 lines)
.env.example         ~1 KB    (30 lines)
README.md            ~8 KB    (350 lines)
DEPLOYMENT_GUIDE.md  ~12 KB   (450 lines)

templates/
  base.html          ~1 KB    (30 lines)
  index.html         ~2 KB    (60 lines)
  lead_form.html     ~3 KB    (80 lines)
  vendor_register.html ~3 KB  (90 lines)
  login.html         ~2 KB    (50 lines)
  lead_success.html  ~1.5 KB  (40 lines)
  vendor_success.html ~2 KB   (50 lines)
  admin_dashboard.html ~6 KB  (180 lines)
  vendor_dashboard.html ~5 KB (150 lines)

Total Project Size: ~50 KB
```

## Database Schema

```
PostgreSQL Database: lead-vendor-db
│
├── Table: admins
│   ├── id (PK)
│   ├── username
│   └── password_hash
│
├── Table: vendors
│   ├── id (PK)
│   ├── vendor_id (UNIQUE)
│   ├── company_name
│   ├── owner_name
│   ├── mobile
│   ├── email
│   ├── city
│   ├── service_type
│   ├── password_hash
│   ├── credits
│   ├── is_active
│   └── created_at
│
├── Table: leads
│   ├── id (PK)
│   ├── system_lead_id (UNIQUE)
│   ├── full_name
│   ├── mobile
│   ├── city
│   ├── service_type
│   ├── budget
│   ├── notes
│   ├── is_duplicate
│   └── created_at
│
├── Table: lead_assignments
│   ├── id (PK)
│   ├── lead_id (FK → leads.id)
│   ├── vendor_id (FK → vendors.id)
│   ├── vendor_lead_number
│   ├── assigned_at
│   ├── whatsapp_sent
│   └── email_sent
│
└── Table: payments
    ├── id (PK)
    ├── vendor_id (FK → vendors.id)
    ├── amount
    ├── credits_purchased
    ├── payment_id
    ├── status
    └── created_at
```

## API Endpoints

```
PUBLIC ENDPOINTS:
├── GET  /                     → Home page
├── GET  /lead-form            → Lead form
├── POST /lead-form            → Submit lead
├── GET  /vendor-register      → Registration form
├── POST /vendor-register      → Create vendor
├── GET  /login                → Login page
└── POST /login                → Authenticate

PROTECTED ENDPOINTS:
├── GET  /admin/dashboard      → Admin panel (admin only)
├── GET  /vendor/dashboard     → Vendor panel (vendor only)
└── GET  /logout               → Clear session

FUTURE ENDPOINTS (to be added):
├── POST /webhook/razorpay     → Payment webhook
├── POST /api/vendor/credits   → Add credits
├── GET  /api/admin/stats      → JSON stats
└── GET  /api/vendor/invoice   → Download invoice
```

## Data Flow

```
LEAD SUBMISSION FLOW:
Customer → /lead-form → Lead Created
    ↓
Duplicate Check (Name + Mobile)
    ↓
Generate System Lead ID
    ↓
Match Vendors (City + Service)
    ↓
For each matching vendor:
    ├── Create Assignment
    ├── Assign Vendor Lead #
    ├── Deduct 1 Credit
    ├── Send WhatsApp
    └── Log Result

VENDOR REGISTRATION FLOW:
New Vendor → /vendor-register
    ↓
Generate Vendor ID
    ↓
Create Vendor (0 credits, INACTIVE)
    ↓
Success Page
    ↓
Login → Dashboard
    ↓
Purchase Credits
    ↓
Activate Account
    ↓
Receive Leads

AUTHENTICATION FLOW:
Login → JWT Token → Cookie
    ↓
Protected Route → Verify Token
    ↓
Decode User ID & Type
    ↓
Load User Data
    ↓
Render Dashboard
```

## Technology Stack Details

```
BACKEND STACK:
├── FastAPI          → Web framework
├── Uvicorn          → ASGI server
├── Gunicorn         → Process manager
├── SQLAlchemy       → ORM
├── PostgreSQL       → Database
├── Python-Jose      → JWT handling
├── Passlib          → Password hashing
└── HTTPx            → Async HTTP client

FRONTEND STACK:
├── Jinja2           → Template engine
├── Tailwind CSS     → Styling (CDN)
├── Chart.js         → Analytics (CDN)
└── Vanilla JS       → Interactivity

DEPLOYMENT STACK:
├── Render           → Hosting platform
├── GitHub           → Version control
├── PostgreSQL       → Managed database
└── HTTPS            → SSL (automatic)

INTEGRATIONS:
├── WhatsApp API     → Notifications
├── SMTP             → Email
└── Razorpay         → Payments
```

## Setup Checklist

```
[ ] 1. Create GitHub repository
[ ] 2. Clone repository locally
[ ] 3. Create templates/ folder
[ ] 4. Add all .py and .txt files
[ ] 5. Add all .html files
[ ] 6. Commit and push to GitHub
[ ] 7. Create Render account
[ ] 8. Deploy via Blueprint
[ ] 9. Configure environment variables
[ ] 10. Test application
[ ] 11. Configure WhatsApp API
[ ] 12. Setup payment gateway
[ ] 13. Change admin password
[ ] 14. Add custom domain (optional)
[ ] 15. Go live! 🚀
```

---

**This structure ensures a clean, maintainable, and scalable codebase.**
