export POSTGRES_URL="sellscale.cfxajv0fcaau.us-east-1.rds.amazonaws.com"
export POSTGRES_PORT="5432"
export POSTGRES_USER="postgres"
export POSTGRES_PASSWORD="password"
export POSTGRES_DB="sellscale"

# Avoid using pip directly
python -m pip install -r requirements.txt
python app.py