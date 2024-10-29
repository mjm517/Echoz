from flask import Flask, jsonify, request
from flask_cors import CORS
import psycopg2
import pandas as pd
from math import radians, sin, cos, sqrt, atan2
from pyngrok import ngrok
from pyngrok.conf import PyngrokConfig

# Set up ngrok authentication
ngrok_auth_token = "2f3zSL5hLaIPtgXIHn7Zk8Xt7Ua_6Pw4iqQHiy7WhFq4nEi88"  # Replace with your ngrok auth token
ngrok.set_auth_token(ngrok_auth_token)

app = Flask(__name__)
CORS(app)

def haversine_distance(lat1, lon1, lat2, lon2):
    """
    Calculate the Haversine distance between two points on Earth.
    Returns distance in meters.
    """
    R = 6371000  # Earth's radius in meters

    # Convert latitude and longitude to radians
    lat1, lon1, lat2, lon2 = map(radians, [lat1, lon1, lat2, lon2])

    # Differences in coordinates
    dlat = lat2 - lat1
    dlon = lon2 - lon1

    # Haversine formula
    a = sin(dlat/2)**2 + cos(lat1) * cos(lat2) * sin(dlon/2)**2
    c = 2 * atan2(sqrt(a), sqrt(1-a))
    distance = R * c

    return distance

# Database connection parameters
db_params = {
    'dbname': 'neondb',
    'user': 'neondb_owner',
    'password': 'YOUR_DATABASE_PASSWORD',  # Replace with your DB password
    'host': 'ep-lively-bonus-a4tiiu8e.us-east-1.aws.neon.tech',
    'sslmode': 'require'
}

@app.route('/', methods=['GET'])
def index():
    """Root route to confirm the server is running."""
    return jsonify({'status': 'yes'})

@app.route('/nearby-locations', methods=['POST'])
def get_nearby_locations():
    try:
        # Get coordinates from POST request body
        data = request.get_json()

        if not data or 'lon' not in data or 'lat' not in data:
            return jsonify({
                'status': 'error',
                'message': 'Missing required parameters: lon and lat'
            }), 400

        # Extract coordinates from request body
        target_lon = float(data['lon'])
        target_lat = float(data['lat'])
        radius = float(data.get('radius', 180))  # Default radius in meters

        # Connect to the database
        conn = psycopg2.connect(**db_params)
        cursor = conn.cursor()

        # Query to fetch all records from the memory table
        cursor.execute("""
            SELECT id, title, description, location, image_url, s3_key, 
                   created_at, latitude, longitude, coordinates
            FROM memory
        """)

        # Fetch all records
        records = cursor.fetchall()

        # Create a DataFrame
        columns = ['id', 'title', 'description', 'location', 'image_url', 
                  's3_key', 'created_at', 'latitude', 'longitude', 'coordinates']
        df = pd.DataFrame(records, columns=columns)

        # Calculate distances for all points
        df['distance'] = df.apply(
            lambda row: haversine_distance(
                target_lat, target_lon, 
                float(row['latitude']), float(row['longitude'])
            ), 
            axis=1
        )

        # Filter points within the radius
        nearby_locations = df[df['distance'] <= radius].copy()

        # Sort by distance
        nearby_locations = nearby_locations.sort_values('distance')

        # Convert to list of dictionaries for JSON response
        results = []
        for _, row in nearby_locations.iterrows():
            results.append({
                'id': row['id'],
                'title': row['title'],
                'description': row['description'],
                'distance': float(row['distance']),
                'latitude': float(row['latitude']),
                'longitude': float(row['longitude']),
                'location': row['location'],
                'image_url': row['image_url'],
                'created_at': row['created_at'].isoformat() if pd.notnull(row['created_at']) else None
            })

        return jsonify({
            'status': 'success',
            'count': len(results),
            'radius': radius,
            'target': {'latitude': target_lat, 'longitude': target_lon},
            'locations': results
        })

    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500

    finally:
        # Close database connection
        if 'conn' in locals():
            cursor.close()
            conn.close()

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy'})

if __name__ == '__main__':
    try:
        # Kill any existing ngrok processes
        ngrok.kill()

        # Start ngrok with authentication
        pyngrok_config = PyngrokConfig(auth_token=ngrok_auth_token)

        # Create tunnel with configuration
        public_url = ngrok.connect(8000, pyngrok_config=pyngrok_config)
        print(f' * Public URL: {public_url}')

        # Run Flask app
        app.run(port=8000)
    except Exception as e:
        print(f"Error starting the server: {e}")
