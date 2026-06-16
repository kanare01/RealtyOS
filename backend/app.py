import os
import sys

# Ensure this directory is in the path so we can do clean "backend" imports
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from backend import create_app
from backend.config import Config

app = create_app()

if __name__ == "__main__":
    port = Config.PORT
    print(f"Starting realtyOS Flask backend on 0.0.0.0:{port}...")
    app.run(host="0.0.0.0", port=port, debug=Config.DEBUG)
