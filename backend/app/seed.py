from datetime import date, timedelta
from app.database.connection import engine, SessionLocal, Base
from app.models.models import Founder, TourPackage, Driver, Car, AvailabilityCalendar, Review, ContactInfo

def seed_data():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    # 1. Founder - Updated Phone Number: 9425331205
    db.add(Founder(
        name="Dinesh Pandey",
        phone="9425331205",
        role="Founder & Chief Wildlife Specialist",
        headquarter="Bandhavgarh, Madhya Pradesh",
        bio="With over 20 years of experience traversing Bandhavgarh, Dinesh Pandey (+91 9425331205) provides royal Bengal tiger tracking, customized fleet transport, and bespoke safari itineraries.",
        image_url="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800"
    ))

    # 2. Tour Packages with Indian Prices (INR ₹)
    packages = [
        TourPackage(
            title="Royal Bengal Tiger Expedition",
            duration="3 Days / 2 Nights",
            price_inr=28500.0,
            price_usd=350.0,
            description="4 Open Jeep Safaris in Tala and Magdhi zones led by expert trackers.",
            highlights="4 Safaris, Luxury Resort Stay, Pick-Up & Drop Included",
            image_url="https://images.unsplash.com/photo-1561731216-c3a4d99437d5?auto=format&fit=crop&q=80&w=800"
        ),
        TourPackage(
            title="Bandhavgarh Fort & Wildlife Heritage Trail",
            duration="4 Days / 3 Nights",
            price_inr=42000.0,
            price_usd=520.0,
            description="Explore tiger sightings combined with ancient Fort history & photography sessions.",
            highlights="6 Safaris, Ancient Fort Trekking, Dedicated Vehicle Support",
            image_url="https://images.unsplash.com/photo-1534177616072-ef7dc120449d?auto=format&fit=crop&q=80&w=800"
        )
    ]
    db.add_all(packages)

    # 3. Cars Fleet: Crysta Innova, Force Traveller, Swift Dzire, Open Gypsy & Custom Requests
    cars = [
        Car(
            name="Innova Crysta", 
            category="Premium SUV Transport", 
            capacity=7, 
            image_url="https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=800",
            description="Ideal for long distance transfers from Jabalpur/Katni to Bandhavgarh."
        ),
        Car(
            name="Force Traveller", 
            category="Group Luxury Van", 
            capacity=13, 
            image_url="https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&q=80&w=800",
            description="Spacious van for families and corporate wildlife groups."
        ),
        Car(
            name="Swift Dzire", 
            category="Comfort Sedan", 
            capacity=4, 
            image_url="https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=800",
            description="Budget-friendly transfers for small families or couples."
        ),
        Car(
            name="Open 4x4 Maruti Gypsy", 
            category="Core Jungle Safari Vehicle", 
            capacity=6, 
            image_url="https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=800",
            description="Forest-approved open 4x4 jeep for safari tracks inside Bandhavgarh."
        ),
        Car(
            name="Personal / Custom Vehicle Request", 
            category="Tailored Transport", 
            capacity=0, 
            image_url="https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&q=80&w=800",
            description="Special requirements? Personal luxury cars, AC buses, or vintage jeeps can be arranged on request."
        )
    ]
    db.add_all(cars)

    # 4. Drivers
    drivers = [
        Driver(name="Ramesh Singh", experience_years=12, rating=4.9, photo_url="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400"),
        Driver(name="Vikram Verma", experience_years=8, rating=4.8, photo_url="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400")
    ]
    db.add_all(drivers)

    # 5. Calendar Availability
    today = date.today()
    for i in range(14):
        db.add(AvailabilityCalendar(date=today + timedelta(days=i), is_available=True, available_slots=5))

    # 6. Testimonials
    reviews = [
        Review(author="Ananya Sharma", location="Delhi, India", rating=5, comment="Dinesh Pandey (9425331205) arranged our Innova Crysta pick-up from Katni station. Smooth journey and great safari!"),
        Review(author="Suresh Kothari", location="Mumbai, India", rating=5, comment="Booked a Force Traveller for our family of 10. Excellent coordination and top-notch safari guide!")
    ]
    db.add_all(reviews)

    # 7. Contact Details
    db.add(ContactInfo(
        hq_address="Tala Gate Main Road, Near Bandhavgarh National Park, Umaria District, MP - 484661",
        phone="9425331205",
        email="dinesh@pandeytigersafaris.com",
        map_coordinates="23.7024° N, 81.0253° E"
    ))

    db.commit()
    db.close()
    print("Database successfully seeded with updated phone (9425331205), vehicles, and INR prices!")

if __name__ == "__main__":
    seed_data()