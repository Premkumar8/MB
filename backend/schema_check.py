import os
import sys
sys.path.append('d:/MB/backend')
from database import engine
from sqlalchemy import text

with engine.connect() as conn:
    res = conn.execute(text("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'users' AND table_schema = 'public'"))
    print("PUBLIC USERS COLUMNS:")
    for row in res:
        print(row)
