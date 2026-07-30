from sqlalchemy import Column, Integer, String, Float, Text, Date, ForeignKey, Boolean
from app.database.connection import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String, nullable=True)  # Null for Google Auth users
    provider = Column(String, default="email")      # "email" or "google"
    google_id = Column(String, nullable=True)

class Founder(Base):
    __tablename__ = "founder"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, default="Dinesh Pandey")
    phone = Column(String, default="9425331205")
    role = Column(String, default="Founder & Master Safari Guide")
    headquarter = Column(String, default="Bandhavgarh National Park")
    bio = Column(Text)
    image_url = Column(String)

class TourPackage(Base):
    __tablename__ = "tour_packages"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    duration = Column(String)
    price_inr = Column(Float)   # Indian Rupees
    price_usd = Column(Float)   # USD Equivalent
    description = Column(Text)
    highlights = Column(Text)
    image_url = Column(String)

class Car(Base):
    __tablename__ = "cars"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)       # e.g., "Innova Crysta", "Force Traveller", "Swift Dzire"
    category = Column(String)   # "Premium SUV", "Group Van", "Comfort Sedan", "Custom Request"
    capacity = Column(Integer)
    image_url = Column(String)
    description = Column(Text, nullable=True)

class Driver(Base):
    __tablename__ = "drivers"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    experience_years = Column(Integer)
    rating = Column(Float)
    photo_url = Column(String)

class AvailabilityCalendar(Base):
    __tablename__ = "availability"
    id = Column(Integer, primary_key=True, index=True)
    date = Column(Date, unique=True, index=True)
    is_available = Column(Boolean, default=True)
    available_slots = Column(Integer, default=5)

class Review(Base):
    __tablename__ = "reviews"
    id = Column(Integer, primary_key=True, index=True)
    author = Column(String)
    location = Column(String)
    rating = Column(Integer)
    comment = Column(Text)

class GuidedBooking(Base):
    __tablename__ = "bookings"
    id = Column(Integer, primary_key=True, index=True)
    customer_name = Column(String)
    customer_email = Column(String)
    customer_phone = Column(String)
    package_id = Column(Integer, ForeignKey("tour_packages.id"))
    car_id = Column(Integer, ForeignKey("cars.id"))
    booking_date = Column(Date)
    guests_count = Column(Integer)
    special_requests = Column(Text, nullable=True)

class CustomPackageRequest(Base):
    __tablename__ = "custom_package_requests"
    id = Column(Integer, primary_key=True, index=True)
    customer_name = Column(String)
    email = Column(String)
    phone = Column(String)
    preferred_dates = Column(String)
    budget_inr = Column(Float)
    requirements = Column(Text)

class ContactInfo(Base):
    __tablename__ = "contact_info"
    id = Column(Integer, primary_key=True, index=True)
    hq_address = Column(String)
    phone = Column(String)
    email = Column(String)
    map_coordinates = Column(String)
