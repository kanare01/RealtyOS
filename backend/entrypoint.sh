
#!/bin/sh

# Verify if we are running in a docker environment with a database
if [ "$DATABASE_URL" ]; then
    echo "Waiting for database..."

    # Extract host and port from DATABASE_URL for netcat
    # Assumes format: postgres://user:pass@host:port/db
    # This is a simplified check; in robust prod, use a python script or pg_isready
    
    # Just sleep for a few seconds to allow DB container to spin up in Compose
    sleep 5
    
    echo "Database started"
fi

# Run migrations (or create tables if using db.create_all in code)
# In a real production app with Flask-Migrate:
# flask db upgrade

echo "Starting Gunicorn..."
exec gunicorn --bind 0.0.0.0:5000 --workers 4 --threads 2 --timeout 60 run:app
