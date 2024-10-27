import logging
from flask import render_template, request, jsonify, flash, redirect, url_for
from app import app, db
from models import Memory
from utils import upload_file_to_s3
from werkzeug.exceptions import RequestEntityTooLarge
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy import func
from geoalchemy2.shape import from_shape
from shapely.geometry import Point
import traceback

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

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
                coordinates=coordinates
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

@app.route('/search')
def search_memories():
    try:
        lat = request.args.get('lat', type=float)
        lng = request.args.get('lng', type=float)
        radius = request.args.get('radius', 10.0, type=float)  # Default 10km radius

        if not lat or not lng:
            return jsonify({'error': 'Latitude and longitude are required'}), 400

        # Create search point
        point = Point(lng, lat)
        search_point = from_shape(point, srid=4326)

        # Find memories within radius
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

        return jsonify({'memories': [memory.to_dict() for memory in memories]})

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
