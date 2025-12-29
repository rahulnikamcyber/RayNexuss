from fastapi import FastAPI, Request, Depends, HTTPException, Form, status
from fastapi.responses import HTMLResponse, JSONResponse, RedirectResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from sqlalchemy import create_engine, Column, Integer, String, Float, DateTime, Boolean, Text, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session, relationship
from datetime import datetime, timedelta
from passlib.context import CryptContext
from jose import JWTError, jwt
import os
from typing import Optional
import httpx
import json

# Configuration
SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-change-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 1440
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./leads.db")
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

WHATSAPP_API_URL = os.getenv("WHATSAPP_API_URL", "")
WHATSAPP_API_TOKEN = os.getenv("WHATSAPP_API_TOKEN", "")
SMTP_HOST = os.getenv("SMTP_HOST", "smtp.gmail.com")
SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))
SMTP_USER = os.getenv("SMTP_USER", "")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD", "")

RAZORPAY_KEY_ID = os.getenv("RAZORPAY_KEY_ID", "")
RAZORPAY_KEY_SECRET = os.getenv("RAZORPAY_KEY_SECRET", "")

# Database setup
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Models
class Vendor(Base):
    __tablename__ = "vendors"
    id = Column(Integer, primary_key=True, index=True)
    vendor_id = Column(String, unique=True, index=True)
    company_name = Column(String)
    owner_name = Column(String)
    mobile = Column(String)
    email = Column(String)
    city = Column(String)
    service_type = Column(String)
    password_hash = Column(String)
    credits = Column(Integer, default=0)
    is_active = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    leads = relationship("LeadAssignment", back_populates="vendor")
    payments = relationship("Payment", back_populates="vendor")

class Lead(Base):
    __tablename__ = "leads"
    id = Column(Integer, primary_key=True, index=True)
    system_lead_id = Column(String, unique=True, index=True)
    full_name = Column(String)
    mobile = Column(String)
    city = Column(String)
    service_type = Column(String)
    budget = Column(Float)
    notes = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
    is_duplicate = Column(Boolean, default=False)
    assignments = relationship("LeadAssignment", back_populates="lead")

class LeadAssignment(Base):
    __tablename__ = "lead_assignments"
    id = Column(Integer, primary_key=True, index=True)
    lead_id = Column(Integer, ForeignKey("leads.id"))
    vendor_id = Column(Integer, ForeignKey("vendors.id"))
    vendor_lead_number = Column(Integer)
    assigned_at = Column(DateTime, default=datetime.utcnow)
    whatsapp_sent = Column(Boolean, default=False)
    email_sent = Column(Boolean, default=False)
    lead = relationship("Lead", back_populates="assignments")
    vendor = relationship("Vendor", back_populates="leads")

class Payment(Base):
    __tablename__ = "payments"
    id = Column(Integer, primary_key=True, index=True)
    vendor_id = Column(Integer, ForeignKey("vendors.id"))
    amount = Column(Float)
    credits_purchased = Column(Integer)
    payment_id = Column(String)
    status = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
    vendor = relationship("Vendor", back_populates="payments")

class Admin(Base):
    __tablename__ = "admins"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True)
    password_hash = Column(String)

# Create tables
Base.metadata.create_all(bind=engine)

# FastAPI app
app = FastAPI(title="Lead-Vendor Platform")
templates = Jinja2Templates(directory="templates")

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Helper functions
def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=15))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def generate_system_lead_id(service: str, city: str, date: datetime, seq: int) -> str:
    date_str = date.strftime("%d%Y%m")
    return f"LD-{service.upper()}-{city.upper()}-{date_str}-{seq:03d}"

def generate_vendor_id(service: str, city: str, seq: int) -> str:
    return f"VD-{service.upper()}-{city.upper()}-{seq:03d}"

async def send_whatsapp(to_number: str, message: str) -> bool:
    if not WHATSAPP_API_URL or not WHATSAPP_API_TOKEN:
        return False
    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                WHATSAPP_API_URL,
                json={"to": to_number, "message": message},
                headers={"Authorization": f"Bearer {WHATSAPP_API_TOKEN}"},
                timeout=10
            )
            return response.status_code == 200
    except:
        return False

async def send_email(to_email: str, subject: str, body: str) -> bool:
    # Simplified email - implement with aiosmtplib in production
    return True

def get_current_user(request: Request, db: Session = Depends(get_db)):
    token = request.cookies.get("access_token")
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("sub")
        user_type = payload.get("type")
        if user_type == "vendor":
            user = db.query(Vendor).filter(Vendor.id == int(user_id)).first()
        else:
            user = db.query(Admin).filter(Admin.id == int(user_id)).first()
        if not user:
            raise HTTPException(status_code=401)
        return {"user": user, "type": user_type}
    except JWTError:
        raise HTTPException(status_code=401)

# Routes
@app.get("/", response_class=HTMLResponse)
async def home(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

@app.get("/lead-form", response_class=HTMLResponse)
async def lead_form(request: Request):
    return templates.TemplateResponse("lead_form.html", {"request": request})

@app.post("/lead-form")
async def submit_lead(
    request: Request,
    full_name: str = Form(...),
    mobile: str = Form(...),
    city: str = Form(...),
    service_type: str = Form(...),
    budget: float = Form(...),
    notes: str = Form(""),
    db: Session = Depends(get_db)
):
    # Check duplicate
    existing = db.query(Lead).filter(
        Lead.full_name == full_name,
        Lead.mobile == mobile
    ).first()
    
    is_duplicate = existing is not None
    
    # Generate system lead ID
    today = datetime.utcnow()
    count = db.query(Lead).filter(
        Lead.created_at >= datetime(today.year, today.month, today.day)
    ).count()
    system_lead_id = generate_system_lead_id(service_type, city, today, count + 1)
    
    # Create lead
    lead = Lead(
        system_lead_id=system_lead_id,
        full_name=full_name,
        mobile=mobile,
        city=city,
        service_type=service_type,
        budget=budget,
        notes=notes,
        is_duplicate=is_duplicate
    )
    db.add(lead)
    db.commit()
    db.refresh(lead)
    
    # Route to vendors if not duplicate
    if not is_duplicate:
        vendors = db.query(Vendor).filter(
            Vendor.city == city,
            Vendor.service_type == service_type,
            Vendor.is_active == True,
            Vendor.credits > 0
        ).all()
        
        for vendor in vendors:
            # Get vendor's lead count
            vendor_lead_count = db.query(LeadAssignment).filter(
                LeadAssignment.vendor_id == vendor.id
            ).count()
            
            assignment = LeadAssignment(
                lead_id=lead.id,
                vendor_id=vendor.id,
                vendor_lead_number=vendor_lead_count + 1
            )
            db.add(assignment)
            
            # Deduct credit
            vendor.credits -= 1
            if vendor.credits == 0:
                vendor.is_active = False
            
            # Send WhatsApp
            message = f"New Lead #{assignment.vendor_lead_number}\n"
            message += f"Customer: {full_name}\n"
            message += f"City: {city}\n"
            message += f"Budget: ₹{budget:,.2f}"
            
            whatsapp_sent = await send_whatsapp(vendor.mobile, message)
            assignment.whatsapp_sent = whatsapp_sent
            
            if not whatsapp_sent:
                email_sent = await send_email(vendor.email, "New Lead", message)
                assignment.email_sent = email_sent
            
            db.commit()
    
    return templates.TemplateResponse("lead_success.html", {
        "request": request,
        "lead_id": system_lead_id
    })

@app.get("/vendor-register", response_class=HTMLResponse)
async def vendor_register_form(request: Request):
    return templates.TemplateResponse("vendor_register.html", {"request": request})

@app.post("/vendor-register")
async def register_vendor(
    request: Request,
    company_name: str = Form(...),
    owner_name: str = Form(...),
    mobile: str = Form(...),
    email: str = Form(...),
    city: str = Form(...),
    service_type: str = Form(...),
    password: str = Form(...),
    db: Session = Depends(get_db)
):
    # Generate vendor ID
    count = db.query(Vendor).filter(
        Vendor.city == city,
        Vendor.service_type == service_type
    ).count()
    vendor_id = generate_vendor_id(service_type, city, count + 1)
    
    vendor = Vendor(
        vendor_id=vendor_id,
        company_name=company_name,
        owner_name=owner_name,
        mobile=mobile,
        email=email,
        city=city,
        service_type=service_type,
        password_hash=hash_password(password)
    )
    db.add(vendor)
    db.commit()
    
    return templates.TemplateResponse("vendor_success.html", {
        "request": request,
        "vendor_id": vendor_id
    })

@app.get("/login", response_class=HTMLResponse)
async def login_form(request: Request):
    return templates.TemplateResponse("login.html", {"request": request})

@app.post("/login")
async def login(
    request: Request,
    username: str = Form(...),
    password: str = Form(...),
    user_type: str = Form(...),
    db: Session = Depends(get_db)
):
    if user_type == "admin":
        user = db.query(Admin).filter(Admin.username == username).first()
        redirect_url = "/admin/dashboard"
    else:
        user = db.query(Vendor).filter(Vendor.email == username).first()
        redirect_url = "/vendor/dashboard"
    
    if not user or not verify_password(password, user.password_hash):
        return templates.TemplateResponse("login.html", {
            "request": request,
            "error": "Invalid credentials"
        })
    
    token = create_access_token(
        data={"sub": str(user.id), "type": user_type},
        expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    
    response = RedirectResponse(url=redirect_url, status_code=302)
    response.set_cookie(key="access_token", value=token, httponly=True)
    return response

@app.get("/admin/dashboard", response_class=HTMLResponse)
async def admin_dashboard(request: Request, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    if current_user["type"] != "admin":
        raise HTTPException(status_code=403)
    
    today = datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)
    week_ago = today - timedelta(days=7)
    month_ago = today - timedelta(days=30)
    
    stats = {
        "total_leads_today": db.query(Lead).filter(Lead.created_at >= today).count(),
        "total_leads_week": db.query(Lead).filter(Lead.created_at >= week_ago).count(),
        "total_leads_month": db.query(Lead).filter(Lead.created_at >= month_ago).count(),
        "duplicate_leads": db.query(Lead).filter(Lead.is_duplicate == True).count(),
        "active_vendors": db.query(Vendor).filter(Vendor.is_active == True).count(),
        "total_revenue": db.query(Payment).filter(Payment.status == "success").with_entities(
            func.sum(Payment.amount)
        ).scalar() or 0
    }
    
    leads = db.query(Lead).order_by(Lead.created_at.desc()).limit(50).all()
    vendors = db.query(Vendor).all()
    
    return templates.TemplateResponse("admin_dashboard.html", {
        "request": request,
        "stats": stats,
        "leads": leads,
        "vendors": vendors
    })

@app.get("/vendor/dashboard", response_class=HTMLResponse)
async def vendor_dashboard(request: Request, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    if current_user["type"] != "vendor":
        raise HTTPException(status_code=403)
    
    vendor = current_user["user"]
    today = datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)
    
    assignments = db.query(LeadAssignment).filter(
        LeadAssignment.vendor_id == vendor.id
    ).order_by(LeadAssignment.assigned_at.desc()).all()
    
    leads_today = sum(1 for a in assignments if a.assigned_at >= today)
    
    return templates.TemplateResponse("vendor_dashboard.html", {
        "request": request,
        "vendor": vendor,
        "assignments": assignments,
        "leads_today": leads_today
    })

@app.get("/logout")
async def logout():
    response = RedirectResponse(url="/login", status_code=302)
    response.delete_cookie("access_token")
    return response

# Initialize admin user
@app.on_event("startup")
async def startup_event():
    db = SessionLocal()
    admin = db.query(Admin).filter(Admin.username == "admin").first()
    if not admin:
        admin = Admin(
            username="admin",
            password_hash=hash_password("admin123")
        )
        db.add(admin)
        db.commit()
    db.close()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=int(os.getenv("PORT", 8000)))
