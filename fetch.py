from flask import Flask, jsonify
import json
import os

# Initialize Flask app
app = Flask(__name__)

# Define the connection string and JSON file path
connection_string = "postgresql://neondb_owner:z0dNl3qGtajo@ep-lively-bonus-a4tiiu8e.us-east-1.aws.neon.tech/neondb?sslmode=require"
json_file_path = "config.json"


# Save the connection string to a JSON file (runs once when script starts)
def save_connection_string_to_json():
    data = {"connection_string": connection_string}
    with open(json_file_path, "w") as json_file:
        json.dump(data, json_file, indent=4)


# Check if the file exists; if not, save it
if not os.path.exists(json_file_path):
    save_connection_string_to_json()


# Define the route to serve JSON
@app.route("/get_connection_string", methods=["GET"])
def get_connection_string():
    # Read the JSON file
    with open(json_file_path, "r") as json_file:
        config_data = json.load(json_file)
    return jsonify(config_data)


# Run the app
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000)
