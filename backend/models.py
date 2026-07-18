import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime, Float, Boolean, ForeignKey, JSON
from sqlalchemy.orm import relationship
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String, nullable=True)
    role = Column(String, default="staff") # admin, super_admin, staff
    
    # Permissions
    can_manage_products = Column(Boolean, default=False)
    can_manage_sales = Column(Boolean, default=False)
    can_manage_customers = Column(Boolean, default=False)
    can_manage_purchases = Column(Boolean, default=False)
    
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True, nullable=False)
    category = Column(String, nullable=True)
    origin = Column(String, nullable=True)
    finish = Column(String, nullable=True)
    thickness = Column(String, nullable=True)
    applications = Column(Text, nullable=True)
    description = Column(Text, nullable=True)
    price = Column(Float, nullable=True)
    availability = Column(String, nullable=True)
    image_url = Column(String, nullable=True)
    images = Column(JSON, nullable=True)

class Customer(Base):
    __tablename__ = "customers"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    phone = Column(String, nullable=True)
    company = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    sales = relationship("Sale", back_populates="customer")

class Sale(Base):
    __tablename__ = "sales"
    
    id = Column(Integer, primary_key=True, index=True)
    customer_id = Column(Integer, ForeignKey("customers.id"))
    total_amount = Column(Float, nullable=False, default=0.0)
    status = Column(String, default="Pending") # Pending, Completed, Cancelled
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    customer = relationship("Customer", back_populates="sales")

class Purchase(Base):
    __tablename__ = "purchases"
    
    id = Column(Integer, primary_key=True, index=True)
    supplier_name = Column(String, index=True, nullable=False)
    item = Column(String, nullable=False)
    cost = Column(Float, nullable=False, default=0.0)
    status = Column(String, default="Ordered") # Ordered, Received, Paid
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class QuoteRequest(Base):
    __tablename__ = "quote_requests"

    id = Column(Integer, primary_key=True, index=True)
    client_name = Column(String, nullable=False)
    client_email = Column(String, nullable=False)
    client_phone = Column(String, nullable=True)
    stone_name = Column(String, nullable=False)
    quantity = Column(Float, nullable=True)
    dimensions = Column(String, nullable=True)
    finish = Column(String, nullable=True)
    budget = Column(String, nullable=True)
    notes = Column(Text, nullable=True)
    drawing_url = Column(String, nullable=True)
    room_image_url = Column(String, nullable=True)
    status = Column(String, default="Pending")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
