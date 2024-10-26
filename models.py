from datetime import datetime
from app import db
from geoalchemy2 import Geometry
from shapely.geometry import Point
import json

class Memory(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text)
    location = db.Column(db.String(200))
    coordinates = db.Column(Geometry('POINT', srid=4326))
    image_url = db.Column(db.String(500), nullable=False)
    s3_key = db.Column(db.String(500), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        data = {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'location': self.location,
            'image_url': self.image_url,
            'created_at': self.created_at.strftime('%Y-%m-%d %H:%M:%S')
        }
        if self.coordinates:
            point = json.loads(db.session.scalar(self.coordinates.ST_AsGeoJSON()))
            data['latitude'] = point['coordinates'][1]
            data['longitude'] = point['coordinates'][0]
        return data

    @staticmethod
    def search_by_location(latitude, longitude, radius_km):
        """
        Search memories within a given radius of a point
        Args:
            latitude: float
            longitude: float
            radius_km: float - radius in kilometers
        Returns:
            List of Memory objects within the radius
        """
        point = f'POINT({longitude} {latitude})'
        return Memory.query.filter(
            Memory.coordinates.ST_DWithin(
                f'SRID=4326;{point}',
                radius_km * 1000  # Convert km to meters
            )
        ).all()
