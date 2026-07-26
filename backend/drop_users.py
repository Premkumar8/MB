import sys
sys.path.append('d:/MB/backend')
from database import engine
from sqlalchemy import text

with engine.connect() as conn:
    conn.execute(text("DROP TABLE IF EXISTS users CASCADE"))
    conn.commit()
    print("Table 'users' dropped.")
