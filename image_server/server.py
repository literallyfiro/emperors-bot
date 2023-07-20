import os
import uuid
import base64
import logging
from flask import Flask, jsonify, request, send_file

app = Flask(__name__)

logger = logging.getLogger("waitress")
logging.basicConfig(level=logging.INFO)

# Directory to store the uploaded images
UPLOAD_DIRECTORY = 'uploads'

@app.route('/api/images', methods=['POST'])
def upload_image():
    image_data = request.json['image']
    _, encoded_data = image_data.split(',')
    
    image_id = str(uuid.uuid4())
    image_bytes = base64.b64decode(encoded_data)
    
    os.makedirs(UPLOAD_DIRECTORY, exist_ok=True)
    
    image_path = os.path.join(UPLOAD_DIRECTORY, f'{image_id}.png')
    with open(image_path, 'wb') as image_file:
        image_file.write(image_bytes)

    logger.info("Image uploaded successfully with id " + image_id + ".")
    return jsonify({'image_id': image_id}), 201


@app.route('/api/images/<image_id>', methods=['GET'])
def get_image(image_id):
    image_path = os.path.join(UPLOAD_DIRECTORY, f'{image_id}.png')
    
    if not os.path.isfile(image_path):
        return jsonify({'error': 'Image not found'}), 404
    
    with open(image_path, 'rb') as image_file:
        image_data = base64.b64encode(image_file.read()).decode('utf-8')
    
    return jsonify({'image': image_data}), 200


@app.route('/api/images/raw/<image_id>', methods=['GET'])
def get_image_raw(image_id):
    image_path = os.path.join(UPLOAD_DIRECTORY, f'{image_id}.png')
    
    if not os.path.isfile(image_path):
        return jsonify({'error': 'Image not found'}), 404
    
    return send_file(image_path, mimetype='image/png'), 200


if __name__ == '__main__':
    from waitress import serve
    serve(app, host="0.0.0.0", port=os.getenv("PORT"))
