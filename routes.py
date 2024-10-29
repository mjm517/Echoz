# import logging
# from flask import render_template, request, jsonify, flash, redirect, url_for
# from app import app, db
# from models import Memory
# from utils import upload_file_to_s3
# from werkzeug.exceptions import RequestEntityTooLarge
# from sqlalchemy.exc import SQLAlchemyError
# from sqlalchemy import func
# from sqlalchemy import create_engine
# from geoalchemy2.shape import from_shape
# from shapely.geometry import Point
# import traceback

# # Configure logging
# logging.basicConfig(level=logging.INFO)
# logger = logging.getLogger(__name__)

# @app.route('/')
# def index():
#     # Get search parameters
#     search_lat = request.args.get('lat', type=float)
#     search_lng = request.args.get('lng', type=float)
#     radius = request.args.get('radius', 10.0, type=float)  # Default 10km radius

#     if search_lat is not None and search_lng is not None:
#         # Search memories within radius km of the specified point
#         point = Point(search_lng, search_lat)
#         search_point = from_shape(point, srid=4326)
        
#         memories = Memory.query.filter(
#             func.ST_DWithin(
#                 func.ST_Transform(Memory.coordinates, 3857),
#                 func.ST_Transform(search_point, 3857),
#                 radius * 1000  # Convert km to meters
#             )
#         ).order_by(
#             func.ST_Distance(
#                 func.ST_Transform(Memory.coordinates, 3857),
#                 func.ST_Transform(search_point, 3857)
#             )
#         ).all()
#     else:
#         memories = Memory.query.order_by(Memory.created_at.desc()).all()

#     return render_template('index.html', memories=memories)

# @app.route('/memory/<int:memory_id>')
# def view_memory(memory_id):
#     memory = Memory.query.get_or_404(memory_id)
#     #check memory id latitude longitude and there cna be a simple statisc for habers using lat and long. 
#     #com
#     #idea 
#     #get from memory id record 
#     return render_template('view_memory.html', memory=memory)

# @app.route('/api/memories', methods=['GET'])
# def haversine(lat1, lon1):
#     R = 6371000  # Earth radius in meters
#     phi1 = math.radians(lat1)
#     phi2 = math.radians(lat2)
#     delta_phi = math.radians(lat2 - lat1)
#     delta_lambda = math.radians(lon2 - lon1)
#     a = math.sin(delta_phi / 2) ** 2 + math.cos(phi1) * math.cos(phi2) * math.sin(delta_lambda / 2) ** 2
#     c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
#     return R * c  # Distance in meters

# def postgres_get(): 
#     engine = create_engine("postgresql://neondb_owner:z0dNl3qGtajo@ep-lively-bonus-a4tiiu8e.us-east-1.aws.neon.tech/neondb?sslmode=require")
#     connection = engine.connect()

    
#     my_query = 'SELECT * FROM memory'
#     results = connection.execute(my_query).fetchall()
#     return results



# def get_memories():
#     try:
#         # Get optional query parameters for pagination
#         page = request.args.get('page', 1, type=int)
#         per_page = request.args.get('per_page', 10, type=int)

#         # Query memories with pagination
#         memories = Memory.query.order_by(Memory.created_at.desc())\
#                         .paginate(page=page, per_page=per_page, error_out=False)

#         # Format the response
#         response = {
#             'memories': [memory.to_dict() for memory in memories.items],
#             'total': memories.total,
#             'pages': memories.pages,
#             'current_page': memories.page
#         }

#         return jsonify(response), 200

#     except Exception as e:
#         logger.error(f"Error fetching memories: {str(e)}\n{traceback.format_exc()}")
#         return jsonify({'error': 'Failed to fetch memories'}), 500

# @app.route('/upload', methods=['POST'])
# def upload_memory():
#     try:
#         if 'image' not in request.files:
#             return jsonify({'error': 'No image uploaded'}), 400
        
#         file = request.files['image']
#         if file.filename == '':
#             return jsonify({'error': 'No selected file'}), 400

#         title = request.form.get('title')
#         description = request.form.get('description')
#         location = request.form.get('location')
#         latitude = request.form.get('latitude')
#         longitude = request.form.get('longitude')

#         if not title:
#             return jsonify({'error': 'Title is required'}), 400

#         try:
#             image_url, s3_key = upload_file_to_s3(file)
#         except ValueError as e:
#             logger.error(f"Invalid file upload: {str(e)}")
#             return jsonify({'error': str(e)}), 400
#         except Exception as e:
#             logger.error(f"S3 upload error: {str(e)}\n{traceback.format_exc()}")
#             return jsonify({'error': 'Failed to upload image to storage'}), 500

#         try:
#             # Create Point geometry if coordinates are provided
#             coordinates = None
#             if latitude and longitude:
#                 point = Point(float(longitude), float(latitude))
#                 coordinates = from_shape(point, srid=4326)

#             memory = Memory(
#                 title=title,
#                 description=description,
#                 location=location,
#                 image_url=image_url,
#                 s3_key=s3_key,
#                 latitude=float(latitude) if latitude else None,
#                 longitude=float(longitude) if longitude else None,
#                 coordinates=coordinates
#             )
            
#             db.session.add(memory)
#             db.session.commit()
#             logger.info(f"Successfully created memory with ID: {memory.id}")

#         except SQLAlchemyError as e:
#             db.session.rollback()
#             logger.error(f"Database error: {str(e)}\n{traceback.format_exc()}")
#             return jsonify({'error': 'Failed to save memory to database'}), 500

#         return jsonify({'success': True, 'memory': memory.to_dict()}), 201

#     except RequestEntityTooLarge:
#         logger.error("File size exceeds maximum limit")
#         return jsonify({'error': 'File too large'}), 413
#     except Exception as e:
#         logger.error(f"Unexpected error in upload_memory: {str(e)}\n{traceback.format_exc()}")
#         return jsonify({'error': 'An unexpected error occurred'}), 500

# @app.route('/search')
# def search_memories():
#     try:
#         lat = request.args.get('lat', type=float)
#         lng = request.args.get('lng', type=float)
#         radius = request.args.get('radius', 10.0, type=float)  # Default 10km radius

#         if not lat or not lng:
#             return jsonify({'error': 'Latitude and longitude are required'}), 400

#         # Create search point
#         point = Point(lng, lat)
#         search_point = from_shape(point, srid=4326)

#         # Find memories within radius
#         memories = Memory.query.filter(
#             func.ST_DWithin(
#                 func.ST_Transform(Memory.coordinates, 3857),
#                 func.ST_Transform(search_point, 3857),
#                 radius * 1000  # Convert km to meters
#             )
#         ).order_by(
#             func.ST_Distance(
#                 func.ST_Transform(Memory.coordinates, 3857),
#                 func.ST_Transform(search_point, 3857)
#             )
#         ).all()

#         return jsonify({'memories': [memory.to_dict() for memory in memories]})

#     except Exception as e:
#         logger.error(f"Search error: {str(e)}\n{traceback.format_exc()}")
#         return jsonify({'error': 'An error occurred during search'}), 500

# app.route('/get_connection_string', methods=['GET'])
# def get_connection_string():
#     try:
#         # Load the JSON file
#         with open(json_file_path, "r") as json_file:
#             config_data = json.load(json_file)
#         return jsonify(config_data), 200
#     except Exception as e:
#         logger.error(f"Error reading connection string: {str(e)}\n{traceback.format_exc()}")
#         return jsonify({'error': 'Failed to fetch connection string'}), 500


# @app.errorhandler(404)
# def not_found_error(error):
#     return render_template('404.html'), 404

# @app.errorhandler(500)
# def internal_error(error):
#     db.session.rollback()
#     logger.error(f"Internal server error: {str(error)}\n{traceback.format_exc()}")
#     return render_template('500.html'), 500


#Attempt 2 

# import logging
# from flask import render_template, request, jsonify, flash, redirect, url_for
# from app import app, db
# from models import Memory
# from utils import upload_file_to_s3
# from werkzeug.exceptions import RequestEntityTooLarge
# from sqlalchemy.exc import SQLAlchemyError
# from sqlalchemy import func, create_engine
# from geoalchemy2.shape import from_shape
# from shapely.geometry import Point
# import traceback
# import math
# import pandas as pd
# from math import radians, sin, cos, sqrt, atan2

# # Configure logging
# logging.basicConfig(level=logging.INFO)
# logger = logging.getLogger(__name__)

# def haversine_distance(lat1, lon1, lat2, lon2):
#     """
#     Calculate the Haversine distance between two points on Earth.
#     Returns distance in meters.
#     """
#     logger.debug(f"Calculating distance between ({lat1}, {lon1}) and ({lat2}, {lon2})")

#     R = 6371000  # Earth's radius in meters

#     # Convert latitude and longitude to radians
#     lat1, lon1, lat2, lon2 = map(radians, [lat1, lon1, lat2, lon2])

#     # Differences in coordinates
#     dlat = lat2 - lat1
#     dlon = lon2 - lon1

#     # Haversine formula
#     a = sin(dlat/2)**2 + cos(lat1) * cos(lat2) * sin(dlon/2)**2
#     c = 2 * atan2(sqrt(a), sqrt(1-a))
#     distance = R * c

#     logger.debug(f"Calculated distance: {distance} meters")
#     return distance

# @app.route('/')
# def index():
#     # Get search parameters
#     search_lat = request.args.get('lat', type=float)
#     search_lng = request.args.get('lng', type=float)
#     radius = request.args.get('radius', 10.0, type=float)  # Default 10km radius

#     if search_lat is not None and search_lng is not None:
#         # Search memories within radius km of the specified point
#         point = Point(search_lng, search_lat)
#         search_point = from_shape(point, srid=4326)

#         memories = Memory.query.filter(
#             func.ST_DWithin(
#                 func.ST_Transform(Memory.coordinates, 3857),
#                 func.ST_Transform(search_point, 3857),
#                 radius * 1000  # Convert km to meters
#             )
#         ).order_by(
#             func.ST_Distance(
#                 func.ST_Transform(Memory.coordinates, 3857),
#                 func.ST_Transform(search_point, 3857)
#             )
#         ).all()
#     else:
#         memories = Memory.query.order_by(Memory.created_at.desc()).all()

#     return render_template('index.html', memories=memories)

# @app.route('/memory/<int:memory_id>')
# def view_memory(memory_id):
#     memory = Memory.query.get_or_404(memory_id)
#     return render_template('view_memory.html', memory=memory)

# @app.route('/api/memories', methods=['GET'])
# def get_memories():
#     try:
#         # Get search parameters
#         target_lat = request.args.get('lat', type=float)
#         target_lon = request.args.get('lng', type=float)
#         radius = request.args.get('radius', 180, type=float)  # Default radius in meters
#         page = request.args.get('page', 1, type=int)
#         per_page = request.args.get('per_page', 10, type=int)

#         # Database connection parameters
#         db_params = {
#             'dbname': 'neondb',
#             'user': 'neondb_owner',
#             'password': 'z0dNl3qGtajo',
#             'host': 'ep-lively-bonus-a4tiiu8e.us-east-1.aws.neon.tech',
#             'sslmode': 'require'
#         }

#         logger.info(f"Searching for memories near ({target_lat}, {target_lon}) within {radius} meters")

#         if target_lat is not None and target_lon is not None:
#             # Use SQLAlchemy query with spatial filtering if coordinates are provided
#             point = Point(target_lon, target_lat)
#             search_point = from_shape(point, srid=4326)

#             query = Memory.query.filter(
#                 func.ST_DWithin(
#                     func.ST_Transform(Memory.coordinates, 3857),
#                     func.ST_Transform(search_point, 3857),
#                     radius
#                 )
#             ).order_by(
#                 func.ST_Distance(
#                     func.ST_Transform(Memory.coordinates, 3857),
#                     func.ST_Transform(search_point, 3857)
#                 )
#             )
#         else:
#             # If no coordinates provided, just order by creation date
#             query = Memory.query.order_by(Memory.created_at.desc())

#         # Apply pagination
#         memories_page = query.paginate(page=page, per_page=per_page, error_out=False)

#         # Convert memories to list of dictionaries with distance if coordinates provided
#         memories_list = []
#         for memory in memories_page.items:
#             memory_dict = memory.to_dict()
#             if target_lat is not None and target_lon is not None and memory.latitude and memory.longitude:
#                 distance = haversine_distance(
#                     target_lat, target_lon,
#                     memory.latitude, memory.longitude
#                 )
#                 memory_dict['distance'] = round(distance, 2)
#             memories_list.append(memory_dict)

#         # Format the response
#         response = {
#             'memories': memories_list,
#             'total': memories_page.total,
#             'pages': memories_page.pages,
#             'current_page': memories_page.page
#         }

#         return jsonify(response), 200

#     except Exception as e:
#         logger.error(f"Error fetching memories: {str(e)}\n{traceback.format_exc()}")
#         return jsonify({'error': 'Failed to fetch memories'}), 500

# @app.route('/upload', methods=['POST'])
# def upload_memory():
#     try:
#         if 'image' not in request.files:
#             return jsonify({'error': 'No image uploaded'}), 400

#         file = request.files['image']
#         if file.filename == '':
#             return jsonify({'error': 'No selected file'}), 400

#         title = request.form.get('title')
#         description = request.form.get('description')
#         location = request.form.get('location')
#         latitude = request.form.get('latitude')
#         longitude = request.form.get('longitude')

#         if not title:
#             return jsonify({'error': 'Title is required'}), 400

#         try:
#             image_url, s3_key = upload_file_to_s3(file)
#         except ValueError as e:
#             logger.error(f"Invalid file upload: {str(e)}")
#             return jsonify({'error': str(e)}), 400
#         except Exception as e:
#             logger.error(f"S3 upload error: {str(e)}\n{traceback.format_exc()}")
#             return jsonify({'error': 'Failed to upload image to storage'}), 500

#         try:
#             # Create Point geometry if coordinates are provided
#             coordinates = None
#             if latitude and longitude:
#                 point = Point(float(longitude), float(latitude))
#                 coordinates = from_shape(point, srid=4326)

#             memory = Memory(
#                 title=title,
#                 description=description,
#                 location=location,
#                 image_url=image_url,
#                 s3_key=s3_key,
#                 latitude=float(latitude) if latitude else None,
#                 longitude=float(longitude) if longitude else None,
#                 coordinates=coordinates
#             )

#             db.session.add(memory)
#             db.session.commit()
#             logger.info(f"Successfully created memory with ID: {memory.id}")

#         except SQLAlchemyError as e:
#             db.session.rollback()
#             logger.error(f"Database error: {str(e)}\n{traceback.format_exc()}")
#             return jsonify({'error': 'Failed to save memory to database'}), 500

#         return jsonify({'success': True, 'memory': memory.to_dict()}), 201

#     except RequestEntityTooLarge:
#         logger.error("File size exceeds maximum limit")
#         return jsonify({'error': 'File too large'}), 413
#     except Exception as e:
#         logger.error(f"Unexpected error in upload_memory: {str(e)}\n{traceback.format_exc()}")
#         return jsonify({'error': 'An unexpected error occurred'}), 500

# @app.route('/search')
# def search_memories():
#     try:
#         lat = request.args.get('lat', type=float)
#         lng = request.args.get('lng', type=float)
#         radius = request.args.get('radius', 200, type=float)  # Default 200 m

#         if not lat or not lng:
#             return jsonify({'error': 'Latitude and longitude are required'}), 400

#         # Create search point
#         point = Point(lng, lat)
#         search_point = from_shape(point, srid=4326)

#         # Find memories within radius
#         memories = Memory.query.filter(
#             func.ST_DWithin(
#                 func.ST_Transform(Memory.coordinates, 3857),
#                 func.ST_Transform(search_point, 3857),
#                 radius * 1000  # Convert km to meters
#             )
#         ).order_by(
#             func.ST_Distance(
#                 func.ST_Transform(Memory.coordinates, 3857),
#                 func.ST_Transform(search_point, 3857)
#             )
#         ).all()

#         return jsonify({'memories': [memory.to_dict() for memory in memories]})

#     except Exception as e:
#         logger.error(f"Search error: {str(e)}\n{traceback.format_exc()}")
#         return jsonify({'error': 'An error occurred during search'}), 500

# @app.errorhandler(404)
# def not_found_error(error):
#     return render_template('404.html'), 404

# @app.errorhandler(500)
# def internal_error(error):
#     db.session.rollback()
#     logger.error(f"Internal server error: {str(error)}\n{traceback.format_exc()}")
#     return render_template('500.html'), 500


# pass raw sql queries to the database
    # insert into this database 
    

# #attempt 3 
# from flask import render_template, request, jsonify
# from app import app, db
# from models import Memories  # Changed from Memory to Memories
# from utils import upload_file_to_s3
# from werkzeug.exceptions import RequestEntityTooLarge
# from sqlalchemy.exc import SQLAlchemyError
# from sqlalchemy import func
# from geoalchemy2.shape import from_shape
# from shapely.geometry import Point
# import traceback
# from datetime import datetime
# import logging

# # Configure logging
# logging.basicConfig(level=logging.INFO)
# logger = logging.getLogger(__name__)

# def format_response(data, total=None, pages=None, current_page=None):
#     """Helper function to format API responses consistently"""
#     response = {
#         'status': 'success',
#         'data': data
#     }

#     if total is not None:
#         response['pagination'] = {
#             'total': total,
#             'pages': pages,
#             'current_page': current_page
#         }

#     return response

# @app.route('/api/memories', methods=['GET'])
# def get_memories():
#     try:
#         # Get search parameters with validation
#         try:
#             lat = request.args.get('lat', type=float)
#             lng = request.args.get('lng', type=float)
#             radius = request.args.get('radius', 10.0, type=float)
#             page = max(1, request.args.get('page', 1, type=int))
#             per_page = min(50, max(1, request.args.get('per_page', 10, type=int)))
#         except ValueError as e:
#             return jsonify({'status': 'error', 'message': 'Invalid parameter values'}), 400

#         # Build base query
#         query = Memories.query  # Changed from Memory to Memories

#         # Apply spatial filter if coordinates provided
#         if lat is not None and lng is not None:
#             point = Point(lng, lat)
#             search_point = from_shape(point, srid=4326)
#             query = query.filter(
#                 func.ST_DWithin(
#                     func.ST_Transform(Memories.coordinates, 3857),  # Changed from Memory to Memories
#                     func.ST_Transform(search_point, 3857),
#                     radius * 1000
#                 )
#             ).order_by(
#                 func.ST_Distance(
#                     func.ST_Transform(Memories.coordinates, 3857),  # Changed from Memory to Memories
#                     func.ST_Transform(search_point, 3857)
#                 )
#             )
#         else:
#             query = query.order_by(Memories.created_date.desc(), Memories.created_time.desc())  # Changed from Memory to Memories

#         # Execute paginated query
#         pagination = query.paginate(page=page, per_page=per_page, error_out=False)
#         memories = [memory.to_dict() for memory in pagination.items]

#         return jsonify(format_response(
#             memories,
#             total=pagination.total,
#             pages=pagination.pages,
#             current_page=pagination.page
#         )), 200

#     except Exception as e:
#         logger.error(f"Error in get_memories: {str(e)}\n{traceback.format_exc()}")
#         return jsonify({
#             'status': 'error',
#             'message': 'An internal error occurred'
#         }), 500

# @app.route('/api/memories/search', methods=['GET'])
# def search_memories():
#     try:
#         # Validate required parameters
#         lat = request.args.get('lat', type=float)
#         lng = request.args.get('lng', type=float)
#         radius = request.args.get('radius', 10.0, type=float)

#         if not all([lat, lng]):
#             return jsonify({
#                 'status': 'error',
#                 'message': 'Latitude and longitude are required'
#             }), 400

#         # Create search point and query
#         point = Point(lng, lat)
#         search_point = from_shape(point, srid=4326)

#         memories = Memories.query.filter(  # Changed from Memory to Memories
#             func.ST_DWithin(
#                 func.ST_Transform(Memories.coordinates, 3857),  # Changed from Memory to Memories
#                 func.ST_Transform(search_point, 3857),
#                 radius * 1000
#             )
#         ).order_by(
#             func.ST_Distance(
#                 func.ST_Transform(Memories.coordinates, 3857),  # Changed from Memory to Memories
#                 func.ST_Transform(search_point, 3857)
#             )
#         ).all()

#         return jsonify(format_response([memory.to_dict() for memory in memories])), 200

#     except Exception as e:
#         logger.error(f"Error in search_memories: {str(e)}\n{traceback.format_exc()}")
#         return jsonify({
#             'status': 'error',
#             'message': 'An internal error occurred'
#         }), 500

# @app.route('/upload', methods=['POST'])  # Changed from '/api/memories' to '/upload'
# def create_memory():
#     try:
#         if 'image' not in request.files:
#             return jsonify({
#                 'status': 'error',
#                 'message': 'No image uploaded'
#             }), 400

#         file = request.files['image']
#         if file.filename == '':
#             return jsonify({
#                 'status': 'error',
#                 'message': 'No selected file'
#             }), 400

#         # Extract and validate required fields
#         data = request.form
#         required_fields = ['title']
#         for field in required_fields:
#             if field not in data:
#                 return jsonify({
#                     'status': 'error',
#                     'message': f'Missing required field: {field}'
#                 }), 400

#         # Upload image to S3
#         try:
#             image_url, s3_key = upload_file_to_s3(file)
#         except Exception as e:
#             logger.error(f"S3 upload error: {str(e)}")
#             return jsonify({
#                 'status': 'error',
#                 'message': 'Failed to upload image'
#             }), 500

#         # Create memory record
#         try:
#             now = datetime.utcnow()
#             coordinates = None
#             if data.get('latitude') and data.get('longitude'):
#                 point = Point(float(data['longitude']), float(data['latitude']))
#                 coordinates = from_shape(point, srid=4326)

#             memory = Memories(  # Changed from Memory to Memories
#                 title=data['title'],
#                 description=data.get('description'),
#                 location=data.get('location'),
#                 image_url=image_url,
#                 s3_key=s3_key,
#                 created_date=now.date(),
#                 created_time=now.time(),
#                 latitude=float(data['latitude']) if data.get('latitude') else None,
#                 longitude=float(data['longitude']) if data.get('longitude') else None,
#                 coordinates=coordinates
#             )

#             db.session.add(memory)
#             db.session.commit()

#             return jsonify({
#                 'status': 'success',
#                 'data': memory.to_dict()
#             }), 201

#         except SQLAlchemyError as e:
#             db.session.rollback()
#             logger.error(f"Database error: {str(e)}")
#             return jsonify({
#                 'status': 'error',
#                 'message': 'Failed to save memory to database'
#             }), 500

#     except Exception as e:
#         logger.error(f"Error in create_memory: {str(e)}\n{traceback.format_exc()}")
#         return jsonify({
#             'status': 'error',
#             'message': 'An internal error occurred'
#         }), 500

# # Error handlers
# @app.errorhandler(404)
# def not_found_error(error):
#     return jsonify({
#         'status': 'error',
#         'message': 'Resource not found'
#     }), 404

# @app.errorhandler(500)
# def internal_error(error):
#     db.session.rollback()
#     logger.error(f"Internal server error: {str(error)}\n{traceback.format_exc()}")
#     return jsonify({
#         'status': 'error',
#         'message': 'An internal server error occurred'
#     }), 500


#Attempt 4 include GROQ. 

import logging
from flask import render_template, request, jsonify, flash, redirect, url_for
from app import app, db
from models import Memory
from utils import upload_file_to_s3
from werkzeug.exceptions import RequestEntityTooLarge
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy import func, create_engine
from geoalchemy2.shape import from_shape
from shapely.geometry import Point
import traceback
import math
import pandas as pd
from math import radians, sin, cos, sqrt, atan2
import os
from dotenv import load_dotenv
from groq import Groq
import base64
from urllib.request import urlopen
import io

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize Groq client
GROQ_API_KEY = os.getenv('GROQ_API_KEY')
if not GROQ_API_KEY:
    logger.error("Groq API key not found. Please set 'GROQ_API_KEY' in your environment variables.")
    raise EnvironmentError("Groq API key not found.")

def encode_image_from_url(image_url):
    """Encode image from URL to base64"""
    logger.debug(f"Encoding image from URL: {image_url}")
    try:
        with urlopen(image_url) as response:
            image_data = response.read()
        encoded_image = base64.b64encode(image_data).decode('utf-8')
        logger.debug(f"Successfully encoded image from URL: {image_url}")
        return encoded_image
    except Exception as e:
        logger.error(f"Error encoding image from URL '{image_url}': {e}")
        return None

def get_groq_metadata(image_url):
    """Get metadata from Groq API for a given image URL"""
    logger.debug(f"Retrieving Groq metadata for image URL: {image_url}")
    try:
        # Initialize Groq client with API key
        client = Groq(api_key=GROQ_API_KEY)
        logger.debug("Initialized Groq client.")

        # Encode image
        base64_image = encode_image_from_url(image_url)
        if not base64_image:
            logger.warning(f"Failed to encode image for URL: {image_url}")
            return None

        # Prepare image data URL
        image_data_url = f"data:image/jpeg;base64,{base64_image}"
        logger.debug(f"Image data URL prepared for Groq API.")

        # Make API call
        chat_completion = client.chat.completions.create(
            messages=[
                {
                    "role": "user",
                    "content": [
                        {"type": "text", "text": "What's in this image?"},
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": image_data_url,
                            },
                        },
                    ],
                }
            ],
            model="llava-v1.5-7b-4096-preview",
        )
        logger.debug("Groq API call successful.")

        metadata = chat_completion.choices[0].message.content
        logger.debug(f"Retrieved metadata: {metadata}")
        return metadata
    except Exception as e:
        logger.error(f"Error getting Groq metadata for URL '{image_url}': {e}")
        return None

def haversine_distance(lat1, lon1, lat2, lon2):
    """
    Calculate the Haversine distance between two points on Earth.
    Returns distance in meters.
    """
    logger.debug(f"Calculating distance between ({lat1}, {lon1}) and ({lat2}, {lon2})")

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

    logger.debug(f"Calculated distance: {distance} meters")
    return distance

@app.route('/')
def index():
    # Get search parameters
    search_lat = request.args.get('lat', type=float)
    search_lng = request.args.get('lng', type=float)
    radius = request.args.get('radius', 10.0, type=float)  # Default 10km radius

    if search_lat is not None and search_lng is not None:
        # Search memories within radius km of the specified point
        point = Point(search_lng, search_lat)
        search_point = from_shape(point, srid=4326)

        memories = Memory.query.filter(
            func.ST_DWithin(
                func.ST_Transform(Memory.coordinates, 3857),
                func.ST_Transform(search_point, 3857),
                radius * 1000  # Convert km to meters
            )
        ).order_by(
            func.ST_Distance(
                func.ST_Transform(Memory.coordinates, 3857),
                func.ST_Transform(search_point, 3857)
            )
        ).all()
    else:
        memories = Memory.query.order_by(Memory.created_at.desc()).all()

    return render_template('index.html', memories=memories)

@app.route('/memory/<int:memory_id>')
def view_memory(memory_id):
    memory = Memory.query.get_or_404(memory_id)
    return render_template('view_memory.html', memory=memory)

@app.route('/upload', methods=['POST'])
def upload_memory():
    try:
        if 'image' not in request.files:
            return jsonify({'error': 'No image uploaded'}), 400

        file = request.files['image']
        if file.filename == '':
            return jsonify({'error': 'No selected file'}), 400

        title = request.form.get('title')
        description = request.form.get('description')
        location = request.form.get('location')
        latitude = request.form.get('latitude')
        longitude = request.form.get('longitude')

        if not title:
            return jsonify({'error': 'Title is required'}), 400

        try:
            image_url, s3_key = upload_file_to_s3(file)
        except ValueError as e:
            logger.error(f"Invalid file upload: {str(e)}")
            return jsonify({'error': str(e)}), 400
        except Exception as e:
            logger.error(f"S3 upload error: {str(e)}\n{traceback.format_exc()}")
            return jsonify({'error': 'Failed to upload image to storage'}), 500

        try:
            # Get metadata from Groq for the uploaded image
            metadata = get_groq_metadata(image_url)

            # Create Point geometry if coordinates are provided
            coordinates = None
            if latitude and longitude:
                point = Point(float(longitude), float(latitude))
                coordinates = from_shape(point, srid=4326)

            memory = Memory(
                title=title,
                description=description,
                location=location,
                image_url=image_url,
                s3_key=s3_key,
                latitude=float(latitude) if latitude else None,
                longitude=float(longitude) if longitude else None,
                coordinates=coordinates,
                ada_metadata=metadata  # Add the metadata to the memory object
            )

            db.session.add(memory)
            db.session.commit()
            logger.info(f"Successfully created memory with ID: {memory.id}")

        except SQLAlchemyError as e:
            db.session.rollback()
            logger.error(f"Database error: {str(e)}\n{traceback.format_exc()}")
            return jsonify({'error': 'Failed to save memory to database'}), 500

        return jsonify({'success': True, 'memory': memory.to_dict()}), 201

    except RequestEntityTooLarge:
        logger.error("File size exceeds maximum limit")
        return jsonify({'error': 'File too large'}), 413
    except Exception as e:
        logger.error(f"Unexpected error in upload_memory: {str(e)}\n{traceback.format_exc()}")
        return jsonify({'error': 'An unexpected error occurred'}), 500

@app.route('/api/memories', methods=['GET'])
def get_memories():
    try:
        # Get search parameters
        target_lat = request.args.get('lat', type=float)
        target_lon = request.args.get('lng', type=float)
        radius = request.args.get('radius', 180, type=float)  # Default radius in meters
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 10, type=int)

        logger.info(f"Searching for memories near ({target_lat}, {target_lon}) within {radius} meters")

        if target_lat is not None and target_lon is not None:
            # Use SQLAlchemy query with spatial filtering if coordinates are provided
            point = Point(target_lon, target_lat)
            search_point = from_shape(point, srid=4326)

            query = Memory.query.filter(
                func.ST_DWithin(
                    func.ST_Transform(Memory.coordinates, 3857),
                    func.ST_Transform(search_point, 3857),
                    radius
                )
            ).order_by(
                func.ST_Distance(
                    func.ST_Transform(Memory.coordinates, 3857),
                    func.ST_Transform(search_point, 3857)
                )
            )
        else:
            # If no coordinates provided, just order by creation date
            query = Memory.query.order_by(Memory.created_at.desc())

        # Apply pagination
        memories_page = query.paginate(page=page, per_page=per_page, error_out=False)

        # Convert memories to list of dictionaries with distance if coordinates provided
        memories_list = []
        for memory in memories_page.items:
            memory_dict = memory.to_dict()
            if target_lat is not None and target_lon is not None and memory.latitude and memory.longitude:
                distance = haversine_distance(
                    target_lat, target_lon,
                    memory.latitude, memory.longitude
                )
                memory_dict['distance'] = round(distance, 2)
            memories_list.append(memory_dict)

        # Format the response
        response = {
            'memories': memories_list,
            'total': memories_page.total,
            'pages': memories_page.pages,
            'current_page': memories_page.page
        }

        return jsonify(response), 200

    except Exception as e:
        logger.error(f"Error fetching memories: {str(e)}\n{traceback.format_exc()}")
        return jsonify({'error': 'Failed to fetch memories'}), 500

# @app.route('/search')
# def search_memories():
#     try:
#         lat = request.args.get('lat', type=float)
#         lng = request.args.get('lng', type=float)
#         radius = request.args.get('radius', 200, type=float)  # Default 200 m

#         if not lat or not lng:
#             return jsonify({'error': 'Latitude and longitude are required'}), 400

#         # Create search point
#         point = Point(lng, lat)
#         search_point = from_shape(point, srid=4326)

#         # Find memories within radius
#         memories = Memory.query.filter(
#             func.ST_DWithin(
#                 func.ST_Transform(Memory.coordinates, 3857),
#                 func.ST_Transform(search_point, 3857),
#                 radius * 1000  # Convert km to meters
#             )
#         ).order_by(
#             func.ST_Distance(
#                 func.ST_Transform(Memory.coordinates, 3857),
#                 func.ST_Transform(search_point, 3857)
#             )
#         ).all()

#         return jsonify({'memories': [memory.to_dict() for memory in memories]})

#     except Exception as e:
#         logger.error(f"Search error: {str(e)}\n{traceback.format_exc()}")
#         return jsonify({'error': 'An error occurred during search'}), 500

# New search functionality: 

#trace the route of my request and where it is getting carried forward to.
#print out or have function calls 
#pipeline 
#1. where we loose variable 
# 2. try to invoke the function seperately. 

# try 2 first 
#None none 


@app.route('/search', methods=['POST'])
def search_memories(request):
    try:
        lat = request.form.get('lat', type=float)
        lng = request.form.get('lng', type=float)
        radius = request.args.get('radius', 180.0, type=float)  # Default 180 miles

        if not lat or not lng:
            return jsonify({'error': 'Latitude and longitude are required'}), 400

        # Convert radius from miles to meters (1 mile = 1609.34 meters)
        radius_meters = radius * 1609.34

        # Create search point
        point = Point(lng, lat)
        search_point = from_shape(point, srid=4326)

        # Find memories within radius
        memories = Memory.query.filter(
            func.ST_DWithin(
                func.ST_Transform(Memory.coordinates, 3857),
                func.ST_Transform(search_point, 3857),
                radius_meters
            )
        ).order_by(
            func.ST_Distance(
                func.ST_Transform(Memory.coordinates, 3857),
                func.ST_Transform(search_point, 3857)
            )
        ).all()

        # Calculate actual distances and add them to the response
        result_memories = []
        for memory in memories:
            memory_dict = memory.to_dict()
            # Get coordinates from the memory
            memory_coords = to_shape(memory.coordinates)
            # Calculate distance using haversine
            distance = haversine_distance(
                lat, lng,
                memory_coords.y, memory_coords.x  # Note: y is lat, x is lng in geometric points
            )
            memory_dict['distance'] = distance
            result_memories.append(memory_dict)

        # Sort by distance
        result_memories.sort(key=lambda x: x['distance'])

        return jsonify({'memories': result_memories})

    except Exception as e:
        logger.error(f"Search error: {str(e)}\n{traceback.format_exc()}")
        return jsonify({'error': 'An error occurred during search'}), 500



@app.errorhandler(404)
def not_found_error(error):
    return render_template('404.html'), 404

@app.errorhandler(500)
def internal_error(error):
    db.session.rollback()
    logger.error(f"Internal server error: {str(error)}\n{traceback.format_exc()}")
    return render_template('500.html'), 500