from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from datetime import date

from app.database.connection import get_db, engine, Base
from app.models import models

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Pandey Tiger Safaris API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Authentication Endpoints
@app.post("/api/auth/register")
def register_user(user_data: dict, db: Session = Depends(get_db)):
    existing = db.query(models.User).filter(models.User.email == user_data.get("email")).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    new_user = models.User(
        name=user_data.get("name"),
        email=user_data.get("email"),
        hashed_password=user_data.get("password"), # In production, use passlib/bcrypt
        provider="email"
    )
    db.add(new_user)
    db.commit()
    return {"status": "success", "message": "User registered successfully", "user": {"name": new_user.name, "email": new_user.email}}

@app.post("/api/auth/login")
def login_user(credentials: dict, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == credentials.get("email")).first()
    if not user or user.hashed_password != credentials.get("password"):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    return {"status": "success", "message": "Logged in successfully", "user": {"name": user.name, "email": user.email}}

@app.post("/api/auth/google")
def google_auth(google_data: dict, db: Session = Depends(get_db)):
    email = google_data.get("email")
    user = db.query(models.User).filter(models.User.email == email).first()
    if not user:
        user = models.User(
            name=google_data.get("name"),
            email=email,
            provider="google",
            google_id=google_data.get("google_id")
        )
        db.add(user)
        db.commit()
    return {"status": "success", "message": "Google Authentication Successful", "user": {"name": user.name, "email": user.email}}

# Data Endpoints
@app.get("/api/founder")
def get_founder(db: Session = Depends(get_db)):
    return db.query(models.Founder).first()

@app.get("/api/packages")
def get_packages(db: Session = Depends(get_db)):
    return db.query(models.TourPackage).all()

@app.get("/api/drivers")
def get_drivers(db: Session = Depends(get_db)):
    return db.query(models.Driver).all()

@app.get("/api/cars")
def get_cars(db: Session = Depends(get_db)):
    return db.query(models.Car).all()

@app.get("/api/reviews")
def get_reviews(db: Session = Depends(get_db)):
    return db.query(models.Review).all()

@app.get("/api/availability")
def get_availability(db: Session = Depends(get_db)):
    return db.query(models.AvailabilityCalendar).filter(models.AvailabilityCalendar.date >= date.today()).all()

@app.get("/api/contact")
def get_contact(db: Session = Depends(get_db)):
    return db.query(models.ContactInfo).first()

@app.post("/api/bookings")
def create_booking(booking_data: dict, db: Session = Depends(get_db)):
    new_booking = models.GuidedBooking(**booking_data)
    db.add(new_booking)
    db.commit()
    db.refresh(new_booking)
    return {"status": "success", "booking_id": new_booking.id, "message": "Booking request received! Team will contact at +91 9425331205."}

@app.post("/api/custom-packages")
def request_custom_package(request_data: dict, db: Session = Depends(get_db)):
    custom_req = models.CustomPackageRequest(**request_data)
    db.add(custom_req)
    db.commit()
    return {"status": "success", "message": "Custom package request submitted! Dinesh Pandey will contact you shortly."}