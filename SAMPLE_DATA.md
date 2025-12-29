# Sample Data & API Examples

## Sample Lead Data

### Lead Submission Example 1
```json
{
  "full_name": "Rajesh Kumar",
  "mobile": "9876543210",
  "city": "MUMBAI",
  "service_type": "SOLAR",
  "budget": 250000,
  "notes": "Need 5kW solar system for residential building"
}
```
**Generated System Lead ID:** `LD-SOLAR-MUMBAI-29202512-001`

### Lead Submission Example 2
```json
{
  "full_name": "Priya Sharma",
  "mobile": "9988776655",
  "city": "DELHI",
  "service_type": "INTERIOR",
  "budget": 500000,
  "notes": "3BHK apartment interior design and execution"
}
```
**Generated System Lead ID:** `LD-INTERIOR-DELHI-29202512-001`

### Lead Submission Example 3
```json
{
  "full_name": "Amit Patel",
  "mobile": "9123456789",
  "city": "SURAT",
  "service_type": "CONSTRUCTION",
  "budget": 5000000,
  "notes": "Commercial building construction, 3 floors"
}
```
**Generated System Lead ID:** `LD-CONSTRUCTION-SURAT-29202512-001`

## Sample Vendor Data

### Vendor Registration Example 1
```json
{
  "company_name": "Sunshine Solar Solutions",
  "owner_name": "Vikram Singh",
  "mobile": "9876543211",
  "email": "vikram@sunshinesolar.com",
  "city": "MUMBAI",
  "service_type": "SOLAR",
  "password": "SecurePass123!"
}
```
**Generated Vendor ID:** `VD-SOLAR-MUMBAI-001`

### Vendor Registration Example 2
```json
{
  "company_name": "Elite Interiors",
  "owner_name": "Neha Gupta",
  "mobile": "9876543212",
  "email": "neha@eliteinteriors.com",
  "city": "DELHI",
  "service_type": "INTERIOR",
  "password": "ElitePass456!"
}
```
**Generated Vendor ID:** `VD-INTERIOR-DELHI-001`

### Vendor Registration Example 3
```json
{
  "company_name": "Premium Plumbers",
  "owner_name": "Sanjay Mehta",
  "mobile": "9876543213",
  "email": "sanjay@premiumplumbers.com",
  "city": "BANGALORE",
  "service_type": "PLUMBING",
  "password": "Plumb789!"
}
```
**Generated Vendor ID:** `VD-PLUMBING-BANGALORE-001`

## Database Sample Records

### Table: admins
```sql
INSERT INTO admins (username, password_hash) VALUES
('admin', '$2b$12$...[bcrypt_hash]...');
```

### Table: vendors
```sql
INSERT INTO vendors (vendor_id, company_name, owner_name, mobile, email, city, service_type, password_hash, credits, is_active, created_at) VALUES
('VD-SOLAR-MUMBAI-001', 'Sunshine Solar Solutions', 'Vikram Singh', '9876543211', 'vikram@sunshinesolar.com', 'MUMBAI', 'SOLAR', '$2b$12$...', 10, true, '2024-12-29 10:00:00'),
('VD-SOLAR-MUMBAI-002', 'GreenPower Solar', 'Rahul Joshi', '9876543214', 'rahul@greenpower.com', 'MUMBAI', 'SOLAR', '$2b$12$...', 5, true, '2024-12-29 10:15:00'),
('VD-INTERIOR-DELHI-001', 'Elite Interiors', 'Neha Gupta', '9876543212', 'neha@eliteinteriors.com', 'DELHI', 'INTERIOR', '$2b$12$...', 0, false, '2024-12-29 10:30:00');
```

### Table: leads
```sql
INSERT INTO leads (system_lead_id, full_name, mobile, city, service_type, budget, notes, is_duplicate, created_at) VALUES
('LD-SOLAR-MUMBAI-29202512-001', 'Rajesh Kumar', '9876543210', 'MUMBAI', 'SOLAR', 250000, 'Need 5kW solar system', false, '2024-12-29 11:00:00'),
('LD-SOLAR-MUMBAI-29202512-002', 'Anjali Desai', '9876543220', 'MUMBAI', 'SOLAR', 300000, '7kW system required', false, '2024-12-29 11:30:00'),
('LD-INTERIOR-DELHI-29202512-001', 'Priya Sharma', '9988776655', 'DELHI', 'INTERIOR', 500000, '3BHK interior', false, '2024-12-29 12:00:00');
```

### Table: lead_assignments
```sql
INSERT INTO lead_assignments (lead_id, vendor_id, vendor_lead_number, assigned_at, whatsapp_sent, email_sent) VALUES
(1, 1, 1, '2024-12-29 11:00:05', true, false),
(1, 2, 1, '2024-12-29 11:00:06', true, false),
(2, 1, 2, '2024-12-29 11:30:05', true, false),
(2, 2, 2, '2024-12-29 11:30:06', false, true);
```

### Table: payments
```sql
INSERT INTO payments (vendor_id, amount, credits_purchased, payment_id, status, created_at) VALUES
(1, 1000.00, 10, 'pay_xyz123abc', 'success', '2024-12-29 09:45:00'),
(2, 500.00, 5, 'pay_abc456def', 'success', '2024-12-29 10:00:00');
```

## WhatsApp Message Templates

### Message When Lead Assigned
```
New Lead #001

Customer: Rajesh Kumar
City: MUMBAI
Budget: ₹250,000.00

Contact: 9876543210

Login to your dashboard for full details:
https://your-app.onrender.com/vendor/dashboard
```

### Message Template with Variables
```python
message = f"""New Lead #{assignment.vendor_lead_number}

Customer: {lead.full_name}
City: {lead.city}
Budget: ₹{lead.budget:,.2f}

Contact: {lead.mobile}
Notes: {lead.notes[:100]}

Login: https://your-app.onrender.com/vendor/dashboard"""
```

## Email Templates

### Email Subject
```
New Lead #001 - SOLAR in MUMBAI
```

### Email Body (HTML)
```html
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; }
        .header { background: #2563eb; color: white; padding: 20px; }
        .content { padding: 20px; }
        .lead-box { background: #f3f4f6; padding: 15px; border-left: 4px solid #2563eb; }
        .button { background: #2563eb; color: white; padding: 10px 20px; text-decoration: none; display: inline-block; margin-top: 20px; }
    </style>
</head>
<body>
    <div class="header">
        <h2>New Lead Assigned!</h2>
    </div>
    <div class="content">
        <p>Hello Vikram Singh,</p>
        <p>You have received a new lead:</p>
        <div class="lead-box">
            <h3>Lead #001</h3>
            <p><strong>Customer:</strong> Rajesh Kumar</p>
            <p><strong>Mobile:</strong> 9876543210</p>
            <p><strong>City:</strong> MUMBAI</p>
            <p><strong>Service:</strong> SOLAR</p>
            <p><strong>Budget:</strong> ₹250,000.00</p>
            <p><strong>Notes:</strong> Need 5kW solar system for residential building</p>
        </div>
        <a href="https://your-app.onrender.com/vendor/dashboard" class="button">View Dashboard</a>
        <p style="margin-top: 20px; color: #6b7280;">
            This lead has been assigned to you and 1 credit has been deducted from your account.
        </p>
    </div>
</body>
</html>
```

## API Request Examples

### cURL Examples

#### Submit Lead
```bash
curl -X POST https://your-app.onrender.com/lead-form \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "full_name=Rajesh Kumar" \
  -d "mobile=9876543210" \
  -d "city=MUMBAI" \
  -d "service_type=SOLAR" \
  -d "budget=250000" \
  -d "notes=Need 5kW solar system"
```

#### Register Vendor
```bash
curl -X POST https://your-app.onrender.com/vendor-register \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "company_name=Sunshine Solar Solutions" \
  -d "owner_name=Vikram Singh" \
  -d "mobile=9876543211" \
  -d "email=vikram@sunshinesolar.com" \
  -d "city=MUMBAI" \
  -d "service_type=SOLAR" \
  -d "password=SecurePass123"
```

#### Login
```bash
curl -X POST https://your-app.onrender.com/login \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=admin" \
  -d "password=admin123" \
  -d "user_type=admin" \
  -c cookies.txt
```

### Python Examples

#### Submit Lead
```python
import requests

url = "https://your-app.onrender.com/lead-form"
data = {
    "full_name": "Rajesh Kumar",
    "mobile": "9876543210",
    "city": "MUMBAI",
    "service_type": "SOLAR",
    "budget": 250000,
    "notes": "Need 5kW solar system"
}

response = requests.post(url, data=data)
print(response.text)
```

#### Register Vendor
```python
import requests

url = "https://your-app.onrender.com/vendor-register"
data = {
    "company_name": "Sunshine Solar Solutions",
    "owner_name": "Vikram Singh",
    "mobile": "9876543211",
    "email": "vikram@sunshinesolar.com",
    "city": "MUMBAI",
    "service_type": "SOLAR",
    "password": "SecurePass123"
}

response = requests.post(url, data=data)
print(response.text)
```

#### Login and Access Dashboard
```python
import requests

session = requests.Session()

# Login
login_url = "https://your-app.onrender.com/login"
login_data = {
    "username": "admin",
    "password": "admin123",
    "user_type": "admin"
}
session.post(login_url, data=login_data)

# Access Dashboard
dashboard_url = "https://your-app.onrender.com/admin/dashboard"
response = session.get(dashboard_url)
print(response.text)
```

### JavaScript/Fetch Examples

#### Submit Lead
```javascript
const submitLead = async () => {
    const formData = new FormData();
    formData.append('full_name', 'Rajesh Kumar');
    formData.append('mobile', '9876543210');
    formData.append('city', 'MUMBAI');
    formData.append('service_type', 'SOLAR');
    formData.append('budget', '250000');
    formData.append('notes', 'Need 5kW solar system');

    const response = await fetch('https://your-app.onrender.com/lead-form', {
        method: 'POST',
        body: formData
    });

    const html = await response.text();
    console.log(html);
};
```

## Testing Scenarios

### Scenario 1: Single Vendor with Credits

**Setup:**
- 1 vendor: SOLAR, MUMBAI, 5 credits, ACTIVE

**Action:**
- Submit lead: SOLAR, MUMBAI, ₹250,000

**Expected Result:**
- Lead assigned to vendor
- Vendor lead number: 1
- Vendor credits: 5 → 4
- WhatsApp sent: true
- Lead visible in vendor dashboard

### Scenario 2: Multiple Vendors with Credits

**Setup:**
- Vendor A: SOLAR, MUMBAI, 10 credits, ACTIVE
- Vendor B: SOLAR, MUMBAI, 5 credits, ACTIVE

**Action:**
- Submit lead: SOLAR, MUMBAI, ₹300,000

**Expected Result:**
- Lead assigned to BOTH vendors
- Vendor A: lead #1, credits 10 → 9
- Vendor B: lead #1, credits 5 → 4
- Both receive WhatsApp
- Both see lead in dashboard

### Scenario 3: Vendor with Zero Credits

**Setup:**
- Vendor A: SOLAR, MUMBAI, 0 credits, INACTIVE

**Action:**
- Submit lead: SOLAR, MUMBAI, ₹250,000

**Expected Result:**
- Lead NOT assigned to Vendor A
- No credit deduction
- No WhatsApp sent
- Lead not visible to Vendor A

### Scenario 4: Duplicate Lead

**Setup:**
- Previous lead: "John Doe", "9876543210"

**Action:**
- Submit lead: "John Doe", "9876543210"

**Expected Result:**
- Lead created with is_duplicate = true
- NOT assigned to any vendor
- Visible in admin dashboard as duplicate
- Duplicate count increases

### Scenario 5: Credit Depletion

**Setup:**
- Vendor: SOLAR, MUMBAI, 1 credit, ACTIVE

**Action:**
- Submit 2 leads: SOLAR, MUMBAI

**Expected Result:**
- Lead 1: Assigned, credits 1 → 0, vendor INACTIVE
- Lead 2: NOT assigned (vendor inactive)

## Dashboard Stats Examples

### Admin Dashboard Stats
```json
{
    "total_leads_today": 15,
    "total_leads_week": 87,
    "total_leads_month": 342,
    "duplicate_leads": 23,
    "active_vendors": 12,
    "total_revenue": 45000.00
}
```

### Vendor Dashboard Stats
```json
{
    "vendor_id": "VD-SOLAR-MUMBAI-001",
    "company_name": "Sunshine Solar Solutions",
    "credits": 7,
    "is_active": true,
    "leads_today": 3,
    "total_leads": 28,
    "success_rate": "85%",
    "total_spent": 3000.00
}
```

## Payment Examples

### Razorpay Payment Link
```javascript
const options = {
    key: RAZORPAY_KEY_ID,
    amount: 100000, // ₹1,000 = 100000 paise
    currency: "INR",
    name: "Lead-Vendor Platform",
    description: "Purchase 10 Lead Credits",
    order_id: "order_xyz123",
    handler: function(response) {
        // Payment success
        console.log(response.razorpay_payment_id);
    }
};

const rzp = new Razorpay(options);
rzp.open();
```

### Webhook Payload (Razorpay)
```json
{
    "event": "payment.captured",
    "payload": {
        "payment": {
            "entity": {
                "id": "pay_xyz123",
                "amount": 100000,
                "currency": "INR",
                "status": "captured",
                "order_id": "order_xyz123",
                "email": "vikram@sunshinesolar.com"
            }
        }
    }
}
```

---

## Useful SQL Queries

### Get Today's Leads
```sql
SELECT * FROM leads
WHERE DATE(created_at) = CURRENT_DATE
ORDER BY created_at DESC;
```

### Get Active Vendors by City
```sql
SELECT * FROM vendors
WHERE city = 'MUMBAI' AND is_active = true
ORDER BY credits DESC;
```

### Get Lead Assignment Count per Vendor
```sql
SELECT 
    v.vendor_id,
    v.company_name,
    COUNT(la.id) as total_leads
FROM vendors v
LEFT JOIN lead_assignments la ON v.id = la.vendor_id
GROUP BY v.id
ORDER BY total_leads DESC;
```

### Get Revenue by Vendor
```sql
SELECT 
    v.vendor_id,
    v.company_name,
    SUM(p.amount) as total_spent
FROM vendors v
LEFT JOIN payments p ON v.id = p.vendor_id AND p.status = 'success'
GROUP BY v.id
ORDER BY total_spent DESC;
```

---

**Use these samples to test your platform thoroughly!**
