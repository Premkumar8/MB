from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

# Token Schemas
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

# User Schemas
class UserBase(BaseModel):
    email: EmailStr
    full_name: Optional[str] = None
    role: Optional[str] = "admin"

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(UserBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

# Product Schemas
class ProductBase(BaseModel):
    name: str
    category: str
    origin: str
    finish: str
    thickness: str
    applications: str
    description: Optional[str] = None
    price: Optional[float] = None
    availability: Optional[str] = "In Stock"
    image_url: str
    glb_url: Optional[str] = None
    texture_url: Optional[str] = None
    roughness: Optional[float] = 0.2
    metalness: Optional[float] = 0.1

class ProductCreate(ProductBase):
    pass

class ProductResponse(ProductBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

# Quote Request Schemas
class QuoteRequestBase(BaseModel):
    client_name: str
    client_email: EmailStr
    client_phone: Optional[str] = None
    stone_name: str
    quantity: Optional[float] = None
    dimensions: Optional[str] = None
    finish: Optional[str] = None
    budget: Optional[str] = None
    notes: Optional[str] = None
    drawing_url: Optional[str] = None
    room_image_url: Optional[str] = None

class QuoteRequestCreate(QuoteRequestBase):
    pass

class QuoteRequestResponse(QuoteRequestBase):
    id: int
    status: str
    created_at: datetime

    class Config:
        from_attributes = True

# Blog Schemas
class BlogPostBase(BaseModel):
    title: str
    slug: str
    content: str
    author: Optional[str] = "Aurelia Design Studio"
    read_time: Optional[str] = "4 min read"
    category: Optional[str] = "Architecture"
    image_url: Optional[str] = None

class BlogPostCreate(BlogPostBase):
    pass

class BlogPostResponse(BlogPostBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

# Testimonial Schemas
class TestimonialBase(BaseModel):
    client_name: str
    company_or_title: Optional[str] = None
    content: str
    rating: Optional[int] = 5
    image_url: Optional[str] = None

class TestimonialCreate(TestimonialBase):
    pass

class TestimonialResponse(TestimonialBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True
