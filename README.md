API Endpoints
Upload Memory

Endpoint: POST /upload
Description: Uploads an image along with metadata to create a new memory.
Parameters: image (file), title (string), description (optional), location (optional), latitude (optional), longitude (optional).
Responses: Success (201), Bad Request (400), File Too Large (413), Server Error (500).
Get Memories

Endpoint: GET /api/memories
Description: Retrieves a list of memories with optional geolocation filtering and pagination.
Parameters: lat, lng, radius, page, per_page.
Responses: Returns a paginated list of memories with optional distance information.
Search Memories

Endpoint: GET /search
Description: Searches for memories near a specific latitude and longitude within a given radius.
Parameters: lat (required), lng (required), radius (optional).
Responses: Returns an array of memory objects matching the criteria.
View Single Memory

Endpoint: GET /memory/<memory_id>
Description: Retrieves the details of a single memory as an HTML page.
Parameters: memory_id (path parameter).
Special Features
Groq Integration: Automatically generates metadata for uploaded images using the Groq API.
Spatial Search: Utilizes PostGIS for spatial queries, allowing searches within a specified radius and ordering results by distance.
Error Handling: Implements robust error handling with appropriate HTTP status codes, error messages, transaction rollbacks, and detailed logging.
Usage Examples
Uploading a Memory
Searching Memories Near a Location
Retrieving a Specific Memory
2. Sample Client Code
Below are sample Python scripts using the requests library to interact with the API. Ensure you have the requests library installed:

bash
Copy code
pip install requests
a. Upload a New Memory
python
Copy code
import requests

# Define the API endpoint
upload_url = "https://21d02ac6-47e3-4b9a-ad55-a7209dd1e222-00-3n4ryx0tiyong.picard.replit.dev/upload"

# Prepare the payload
payload = {
    'title': 'Beach Day',
    'description': 'Beautiful sunset at the beach',
    'latitude': 34.0522,
    'longitude': -118.2437
}

# Path to the image you want to upload
image_path = 'path/to/your/photo.jpg'

# Open the image file in binary mode
with open(image_path, 'rb') as img:
    files = {
        'image': img
    }
    # Make the POST request
    response = requests.post(upload_url, data=payload, files=files)

# Check the response
if response.status_code == 201:
    print("Memory uploaded successfully:")
    print(response.json())
else:
    print(f"Failed to upload memory. Status Code: {response.status_code}")
    print(response.json())
b. Get Memories with Optional Geolocation and Pagination
python
Copy code
import requests

# Define the API endpoint
get_memories_url = "https://21d02ac6-47e3-4b9a-ad55-a7209dd1e222-00-3n4ryx0tiyong.picard.replit.dev/api/memories"

# Define query parameters
params = {
    'lat': 34.0522,        # Optional
    'lng': -118.2437,      # Optional
    'radius': 500,         # Optional, in meters
    'page': 1,             # Optional
    'per_page': 10        # Optional
}

# Make the GET request
response = requests.get(get_memories_url, params=params)

# Check the response
if response.status_code == 200:
    data = response.json()
    print(f"Total Memories: {data['total']}")
    print(f"Page {data['current_page']} of {data['pages']}")
    for memory in data['memories']:
        print(memory)
else:
    print(f"Failed to retrieve memories. Status Code: {response.status_code}")
    print(response.json())
c. Search Memories Near a Specific Location
python
Copy code
import requests

# Define the API endpoint
search_url = "https://21d02ac6-47e3-4b9a-ad55-a7209dd1e222-00-3n4ryx0tiyong.picard.replit.dev/search"

# Define query parameters
params = {
    'lat': 34.0522,        # Required
    'lng': -118.2437,      # Required
    'radius': 500          # Optional, in meters
}

# Make the GET request
response = requests.get(search_url, params=params)

# Check the response
if response.status_code == 200:
    data = response.json()
    for memory in data['memories']:
        print(memory)
else:
    print(f"Failed to search memories. Status Code: {response.status_code}")
    print(response.json())
d. View a Single Memory
Since this endpoint returns an HTML page, you can fetch it using requests and display or process it as needed.

python
Copy code
import requests

# Define the memory ID you want to view
memory_id = 123

# Define the API endpoint
view_memory_url = f"https://21d02ac6-47e3-4b9a-ad55-a7209dd1e222-00-3n4ryx0tiyong.picard.replit.dev/memory/{memory_id}"

# Make the GET request
response = requests.get(view_memory_url)

# Check the response
if response.status_code == 200:
    html_content = response.text
    # You can save it to a file or process it as needed
    with open('memory.html', 'w', encoding='utf-8') as file:
        file.write(html_content)
    print("Memory details saved to memory.html")
else:
    print(f"Failed to retrieve memory. Status Code: {response.status_code}")
    print(response.text)
3. Suggestions for Enhancements
Authentication & Authorization:

Implement authentication mechanisms (e.g., JWT, OAuth) to secure the API endpoints.
Restrict access to certain endpoints based on user roles or permissions.
Rate Limiting:

Prevent abuse by limiting the number of requests a client can make within a specific timeframe.
Validation Enhancements:

Use more robust validation for input data to ensure data integrity (e.g., validate URL formats, coordinate ranges).
Pagination Improvements:

Include links for next, previous, first, and last pages to facilitate easier navigation.
Caching:

Implement caching strategies for frequently accessed data to improve performance.
Documentation Enhancements:

Add examples for error responses to help developers handle different error scenarios.
Provide more detailed explanations for optional parameters and their defaults.
Testing:

Develop comprehensive unit and integration tests to ensure the reliability of the API.
Versioning:

Consider versioning the API (e.g., /api/v1/memories) to manage future changes without breaking existing clients.
Webhooks or Real-time Updates:

Implement webhooks or use technologies like WebSockets for real-time updates when new memories are uploaded.
Advanced Search Filters:

Allow filtering memories based on date ranges, keywords in titles/descriptions, or other metadata.
