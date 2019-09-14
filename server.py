from flask import Flask, jsonify
from flask_cors import CORS

# configuration
DEBUG = True

# instantiate the app
app = Flask(__name__)
app.config.from_object(__name__)

# enable CORS
CORS(app)

# sanity check route
@app.route('/cards', methods=['GET'])
def getCards():
    return jsonify('card')

if __name__ == "__main__":
    app.run("0.0.0.0", 5000)