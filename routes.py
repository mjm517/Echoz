import logging
from flask import render_template, request, jsonify, flash, redirect, url_for
from app import app, db
from models import Memory
from utils import upload_file_to_s3
from werkzeug.exceptions import RequestEntityTooLarge
from sqlalchemy.exc import SQLAlchemyError
import traceback

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@app.route('/')
def index():
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
            memory = Memory(
                title=title,
                description=description,
                location=location,
                image_url=image_url,
                s3_key=s3_key
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

@app.errorhandler(404)
def not_found_error(error):
    return render_template('404.html'), 404

@app.errorhandler(500)
def internal_error(error):
    db.session.rollback()
    logger.error(f"Internal server error: {str(error)}\n{traceback.format_exc()}")
    return render_template('500.html'), 500
