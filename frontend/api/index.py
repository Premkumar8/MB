import os
import sys

# Add the parent directory of this file (which is frontend/) to python import path
# so that python can resolve absolute imports like `backend.main`
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from backend.main import app
