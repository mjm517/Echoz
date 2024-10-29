# Method 2: Using Python requests
import requests 
from flask import render_template, request, jsonify, flash, redirect, url_for

def test_search_endpoint():
    # Test case 1: Basic search with default radius
    response = requests.post(
        'https://21d02ac6-47e3-4b9a-ad55-a7209dd1e222-00-3n4ryx0tiyong.picard.replit.dev/search',
        data={'lat': 37.7749, 'lng': -122.4194}
    )
    print("Test 1 - Default radius (180 miles):", response.json())

    # Test case 2: Search with custom radius (5 miles)
    response = requests.post(
        'https://21d02ac6-47e3-4b9a-ad55-a7209dd1e222-00-3n4ryx0tiyong.picard.replit.dev/search?radius=5',
        data={'lat': 37.7749, 'lng': -122.4194}
    )
    print("Test 2 - 5 mile radius:", response.json())

    # Test case 3: Missing coordinates
    response = requests.post(
        'https://21d02ac6-47e3-4b9a-ad55-a7209dd1e222-00-3n4ryx0tiyong.picard.replit.dev/search',
        data={'lat': 37.7749}  # Missing longitude
    )
    print("Test 3 - Missing coordinates:", response.json())

    # Test case 4: Very small radius (0.1 miles)
    response = requests.post(
        'https://21d02ac6-47e3-4b9a-ad55-a7209dd1e222-00-3n4ryx0tiyong.picard.replit.dev/search?radius=0.1',
        data={'lat': 37.7749, 'lng': -122.4194}
    )
    print("Test 4 - Small radius (0.1 miles):", response.json())


# Method 3: Using Flask's test client
from flask import Flask
from flask.testing import FlaskClient

def test_with_flask_client(app: Flask):
    client = app.test_client()

    # Test different radius values
    test_cases = [
        {
            'url': '/search?radius=5',
            'data': {'lat': 37.7749, 'lng': -122.4194},
            'description': '5 mile radius'
        },
        {
            'url': '/search',  # Default radius
            'data': {'lat': 37.7749, 'lng': -122.4194},
            'description': 'Default radius'
        },
        {
            'url': '/search?radius=0.1',
            'data': {'lat': 37.7749, 'lng': -122.4194},
            'description': 'Very small radius'
        }
    ]

    for test_case in test_cases:
        response = client.post(
            test_case['url'],
            data=test_case['data']
        )
        print(f"Test {test_case['description']}:", response.json)

        # Verify the response structure
        result = response.json
        assert 'memories' in result, f"Response missing 'memories' key for {test_case['description']}"

        if 'memories' in result and len(result['memories']) > 0:
            # Verify each memory has a distance
            for memory in result['memories']:
                assert 'distance' in memory, f"Memory missing distance in {test_case['description']}"

            # Verify memories are sorted by distance
            distances = [m['distance'] for m in result['memories']]
            assert distances == sorted(distances), f"Memories not properly sorted in {test_case['description']}"


# Example usage:
if __name__ == '__main__':
    # Create a test database with some sample data first
    test_search_endpoint()
