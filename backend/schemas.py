from pydantic import BaseModel, EmailStr
from typing import Optional, List, Dict, Any, Union
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
    role: Optional[str] = "staff"
    can_manage_products: bool = False
    can_manage_sales: bool = False
    can_manage_customers: bool = False
    can_manage_purchases: bool = False

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
    category: Optional[str] = None
    origin: Optional[str] = None
    finish: Optional[str] = None
    thickness: Optional[str] = None
    applications: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    availability: Optional[str] = None
    image_url: Optional[str] = None
    images: Optional[Union[List[str], List[Dict[str, Any]]]] = None
    glb_url: Optional[str] = None
    texture_url: Optional[str] = None
    roughness: Optional[float] = 0.2
    metalness: Optional[float] = 0.1

class ProductCreate(ProductBase):
    pass

class ProductResponse(ProductBase):
    id: int

    class Config:
        from_attributes = True

# Customer Schemas
class CustomerBase(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = None
    company: Optional[str] = None

class CustomerCreate(CustomerBase):
    pass

class CustomerResponse(CustomerBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

# Sale Schemas
class SaleBase(BaseModel):
    customer_id: int
    total_amount: float
    status: Optional[str] = "Pending"

class SaleCreate(SaleBase):
    pass

class SaleResponse(SaleBase):
    id: int
    created_at: datetime
    customer: Optional[CustomerResponse] = None

    class Config:
        from_attributes = True

# Purchase Schemas
class PurchaseBase(BaseModel):
    supplier_name: str
    item: str
    cost: float
    status: Optional[str] = "Ordered"

class PurchaseCreate(PurchaseBase):
    pass

class PurchaseResponse(PurchaseBase):
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
