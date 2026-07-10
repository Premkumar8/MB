import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime, Float
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String, nullable=True)
    role = Column(String, default="admin") # admin or super_admin
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True, nullable=False)
    category = Column(String, nullable=False) # Marble, Onyx, Quartzite, Granite
    origin = Column(String, nullable=False) # Italy, Brazil, Greece, Spain
    finish = Column(String, nullable=False) # Polished, Honed, Brushed, Leathered
    thickness = Column(String, nullable=False) # 2cm, 3cm, 5cm
    applications = Column(String, nullable=False) # Countertops, Cladding, Flooring
    description = Column(Text, nullable=True)
    price = Column(Float, nullable=True) # Optional premium price indication
    availability = Column(String, default="In Stock") # In Stock, Limited, Backordered
    image_url = Column(String, nullable=False) # Primary preview
    glb_url = Column(String, nullable=True) # 3D slab asset
    texture_url = Column(String, nullable=True) # PBR texture mapping
    roughness = Column(Float, default=0.2)
    metalness = Column(Float, default=0.1)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class QuoteRequest(Base):
    __tablename__ = "quote_requests"

    id = Column(Integer, primary_key=True, index=True)
    client_name = Column(String, nullable=False)
    client_email = Column(String, nullable=False)
    client_phone = Column(String, nullable=True)
    stone_name = Column(String, nullable=False)
    quantity = Column(Float, nullable=True) # Square footage / slabs
    dimensions = Column(String, nullable=True) # e.g. "120in x 65in"
    finish = Column(String, nullable=True)
    budget = Column(String, nullable=True) # e.g. "$5k - $10k"
    notes = Column(Text, nullable=True)
    drawing_url = Column(String, nullable=True) # Blueprint attachment
    room_image_url = Column(String, nullable=True) # Room picture for overlaying
    status = Column(String, default="Pending") # Pending, Reviewed, Quoted
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class BlogPost(Base):
    __tablename__ = "blog_posts"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, unique=True, nullable=False)
    slug = Column(String, unique=True, index=True, nullable=False)
    content = Column(Text, nullable=False)
    author = Column(String, default="Aurelia Design Studio")
    read_time = Column(String, default="4 min read")
    category = Column(String, default="Architecture") # Design, Care, Architecture
    image_url = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class Testimonial(Base):
    __tablename__ = "testimonials"

    id = Column(Integer, primary_key=True, index=True)
    client_name = Column(String, nullable=False)
    company_or_title = Column(String, nullable=True)
    content = Column(Text, nullable=False)
    rating = Column(Integer, default=5)
    image_url = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
