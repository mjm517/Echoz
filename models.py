from datetime import datetime
from app import db
from geoalchemy2 import Geometry
from geoalchemy2.shape import to_shape
from shapely.geometry import Point

class Memory(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text)
    location = db.Column(db.String(200))
    image_url = db.Column(db.String(500), nullable=False)
    s3_key = db.Column(db.String(500), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    latitude = db.Column(db.Numeric(9,6), nullable=True)
    longitude = db.Column(db.Numeric(9,6), nullable=True)
    coordinates = db.Column(Geometry('POINT', srid=4326))
    
    def to_dict(self):
        coordinates_shape = to_shape(self.coordinates) if self.coordinates else None
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'location': self.location,
            'image_url': self.image_url,
            'created_at': self.created_at.strftime('%Y-%m-%d %H:%M:%S'),
            'latitude': float(self.latitude) if self.latitude is not None else None,
            'longitude': float(self.longitude) if self.longitude is not None else None,
            'coordinates': {
                'type': 'Point',
                'coordinates': [coordinates_shape.x, coordinates_shape.y]
            } if coordinates_shape else None
        }
