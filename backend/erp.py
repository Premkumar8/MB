from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
import models, schemas, auth
from database import get_db

router = APIRouter(prefix="/api/erp", tags=["ERP"])

# --- Authorization Dependencies ---
def check_products_permission(current_user: models.User = Depends(auth.get_current_user)):
    if not (current_user.role in ["admin", "super_admin"] or current_user.can_manage_products):
        raise HTTPException(status_code=403, detail="Not enough permissions to manage products")
    return current_user

def check_sales_permission(current_user: models.User = Depends(auth.get_current_user)):
    if not (current_user.role in ["admin", "super_admin"] or current_user.can_manage_sales):
        raise HTTPException(status_code=403, detail="Not enough permissions to manage sales")
    return current_user

def check_customers_permission(current_user: models.User = Depends(auth.get_current_user)):
    if not (current_user.role in ["admin", "super_admin"] or current_user.can_manage_customers):
        raise HTTPException(status_code=403, detail="Not enough permissions to manage customers")
    return current_user

def check_purchases_permission(current_user: models.User = Depends(auth.get_current_user)):
    if not (current_user.role in ["admin", "super_admin"] or current_user.can_manage_purchases):
        raise HTTPException(status_code=403, detail="Not enough permissions to manage purchases")
    return current_user

def check_staff_permission(current_user: models.User = Depends(auth.get_current_user)):
    if current_user.role not in ["super_admin", "admin"]:
        raise HTTPException(status_code=403, detail="Only admins can manage staff")
    return current_user

# ==========================================
# STAFF MANAGEMENT
# ==========================================
@router.get("/staff", response_model=List[schemas.UserResponse])
def get_staff(db: Session = Depends(get_db), current_user: models.User = Depends(check_staff_permission)):
    return db.query(models.User).all()

@router.put("/staff/{user_id}", response_model=schemas.UserResponse)
def update_staff_permissions(user_id: int, permissions: dict, db: Session = Depends(get_db), current_user: models.User = Depends(check_staff_permission)):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Update boolean permissions
    if "can_manage_products" in permissions: user.can_manage_products = permissions["can_manage_products"]
    if "can_manage_sales" in permissions: user.can_manage_sales = permissions["can_manage_sales"]
    if "can_manage_customers" in permissions: user.can_manage_customers = permissions["can_manage_customers"]
    if "can_manage_purchases" in permissions: user.can_manage_purchases = permissions["can_manage_purchases"]
    if "role" in permissions: user.role = permissions["role"]
    
    db.commit()
    db.refresh(user)
    return user

# ==========================================
# CUSTOMERS
# ==========================================
@router.get("/customers", response_model=List[schemas.CustomerResponse])
def get_customers(skip: int = 0, limit: int = 100, db: Session = Depends(get_db), current_user: models.User = Depends(check_customers_permission)):
    return db.query(models.Customer).offset(skip).limit(limit).all()

@router.post("/customers", response_model=schemas.CustomerResponse)
def create_customer(customer: schemas.CustomerCreate, db: Session = Depends(get_db), current_user: models.User = Depends(check_customers_permission)):
    db_customer = models.Customer(**customer.dict())
    db.add(db_customer)
    db.commit()
    db.refresh(db_customer)
    return db_customer

# ==========================================
# SALES
# ==========================================
@router.get("/sales", response_model=List[schemas.SaleResponse])
def get_sales(skip: int = 0, limit: int = 100, db: Session = Depends(get_db), current_user: models.User = Depends(check_sales_permission)):
    return db.query(models.Sale).offset(skip).limit(limit).all()

@router.post("/sales", response_model=schemas.SaleResponse)
def create_sale(sale: schemas.SaleCreate, db: Session = Depends(get_db), current_user: models.User = Depends(check_sales_permission)):
    db_sale = models.Sale(**sale.dict())
    db.add(db_sale)
    db.commit()
    db.refresh(db_sale)
    return db_sale

# ==========================================
# PURCHASES
# ==========================================
@router.get("/purchases", response_model=List[schemas.PurchaseResponse])
def get_purchases(skip: int = 0, limit: int = 100, db: Session = Depends(get_db), current_user: models.User = Depends(check_purchases_permission)):
    return db.query(models.Purchase).offset(skip).limit(limit).all()

@router.post("/purchases", response_model=schemas.PurchaseResponse)
def create_purchase(purchase: schemas.PurchaseCreate, db: Session = Depends(get_db), current_user: models.User = Depends(check_purchases_permission)):
    db_purchase = models.Purchase(**purchase.dict())
    db.add(db_purchase)
    db.commit()
    db.refresh(db_purchase)
    return db_purchase
