from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import os

app = Flask(__name__)
# Enable CORS for all routes, or specify origins for production
CORS(app, resources={r"/predict": {"origins": "*"}})

# Define the path to the model file relative to this script
MODEL_PATH = os.path.join(os.path.dirname(__file__), 'model.pkl')

try:
    # Load the machine learning model
    model = joblib.load(MODEL_PATH)
    print(f"Model loaded successfully from {MODEL_PATH}")
except FileNotFoundError:
    print(f"Error: Model file not found at {MODEL_PATH}")
    model = None # Set model to None if not found
except Exception as e:
    print(f"Error loading model: {e}")
    model = None

@app.route('/predict', methods=['POST'])
def predict():
    if model is None:
        return jsonify({'error': 'Model not loaded. Cannot make predictions.'}), 500

    try:
        data = request.get_json()
        if not data:
            return jsonify({'error': 'Invalid JSON input'}), 400

        # Example of how to use the loaded model data
        # In a real scenario, you would pass 'data' to your model's predict method
        # For this dummy model, we'll just use the placeholder data
        # Example: prediction = model.predict([list(data.values())]) # If model expects a list of lists
        # For our dummy model, we'll just return a simulated prediction based on input presence
        
        # Simulate prediction based on input data
        # In a real scenario, you'd use the 'data' dictionary to make a prediction
        # For example:
        # customer_features = [
        #     data.get('plan_type'), data.get('device_brand'), data.get('avg_data_usage_gb'),
        #     data.get('pct_video_usage'), data.get('avg_call_duration'), data.get('sms_freq'),
        #     data.get('monthly_spend'), data.get('topup_freq'), data.get('travel_score'),
        #     data.get('complaint_count')
        # ]
        # predicted_offer = model['prediction'] # Accessing the dummy prediction

        # For this example, we'll just return a hardcoded prediction or one derived from input
        # If the input contains 'monthly_spend', we'll simulate a different offer
        if 'monthly_spend' in data and data['monthly_spend'] > 50:
            predicted_offer = "Premium Plan Upgrade"
        else:
            predicted_offer = model.get('prediction', 'Standard Offer') # Use dummy prediction if available

        return jsonify({'predicted_offer': predicted_offer})

    except Exception as e:
        print(f"Error during prediction: {e}")
        return jsonify({'error': 'An internal error occurred during prediction.'}), 500

if __name__ == '__main__':
    # Run the Flask app on port 5001
    # Use host='0.0.0.0' to make it accessible from other machines on the network (useful for Docker)
    app.run(host='0.0.0.0', port=5001, debug=True)
