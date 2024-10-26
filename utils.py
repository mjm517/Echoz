import os
import boto3
from botocore.config import Config
import uuid
from werkzeug.utils import secure_filename

def get_s3_client():
    config = Config(
        region_name='us-east-1',
        retries={'max_attempts': 3}
    )
    return boto3.client(
        's3',
        config=config,
        aws_access_key_id=os.environ.get('AWS_ACCESS_KEY_ID'),
        aws_secret_access_key=os.environ.get('AWS_SECRET_ACCESS_KEY')
    )

def allowed_file(filename):
    ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def upload_file_to_s3(file):
    if not allowed_file(file.filename):
        raise ValueError('File type not allowed')
    
    filename = secure_filename(file.filename)
    unique_filename = f'{uuid.uuid4()}-{filename}'
    
    # Determine content type
    content_type = {
        'png': 'image/png',
        'jpg': 'image/jpeg',
        'jpeg': 'image/jpeg',
        'gif': 'image/gif'
    }.get(filename.rsplit('.', 1)[1].lower(), 'application/octet-stream')
    
    s3_client = get_s3_client()
    bucket_name = os.environ.get('AWS_BUCKET_NAME')
    
    try:
        s3_client.upload_fileobj(
            file,
            bucket_name,
            unique_filename,
            ExtraArgs={
                'ContentType': content_type
            }
        )
        
        # Generate the URL for the uploaded file using region-specific format
        region = s3_client.meta.region_name
        url = f'https://s3.{region}.amazonaws.com/{bucket_name}/{unique_filename}'
        return url, unique_filename
    except Exception as e:
        raise Exception(f'Error uploading to S3: {str(e)}')
