from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import os
import pandas as pd
import numpy as np

app = Flask(__name__)
# Izinkan CORS agar frontend bisa akses
CORS(app, resources={r"/predict": {"origins": "*"}})

# --- KONFIGURASI MODEL ---
MODEL_PATH = os.path.join(os.path.dirname(__file__), 'model.pkl')
model = None

# Load Model saat aplikasi start
try:
    model = joblib.load(MODEL_PATH)
    print(f"✅ Model loaded successfully from {MODEL_PATH}")
except FileNotFoundError:
    print(f"❌ Error: Model file not found at {MODEL_PATH}")
except Exception as e:
    print(f"❌ Error loading model: {e}")

# --- FUNGSI PEMBANTU (Mapping Input User ke Angka Dataset) ---
def preprocess_input(data):
    """
    Mengubah input string dari form HTML menjadi format angka/fitur
    yang dimengerti oleh Model Machine Learning.
    """
    
    # 1. Mapping Penggunaan Internet (Target: avg_data_usage_gb)
    # Kita estimasi angka berdasarkan pilihan user
    data_usage_map = {
        'light': 0.5,
        'medium': 2.0,
        'heavy': 4.0,
        'extreme': 8.0
    }
    
    # 2. Mapping Streaming Video (Target: pct_video_usage 0.0 - 1.0)
    video_map = {
        'rarely': 0.1,      # 10% usage buat video
        'sometimes': 0.4,   # 40% usage
        'often': 0.8        # 80% usage
    }
    
    # 3. Mapping Telepon (Target: avg_call_duration dalam menit)
    call_map = {
        'low': 2.0,
        'medium': 8.0,
        'high': 15.0
    }
    
    # 4. Mapping SMS (Target: sms_freq)
    sms_map = {
        'low': 2,
        'medium': 10,
        'high': 25
    }
    
    # 5. Mapping Budget (Target: monthly_spend dalam Rupiah)
    budget_map = {
        'economy': 40000,
        'standard': 75000,
        'premium': 125000,
        'vip': 180000
    }
    
    # 6. Mapping Travel (Target: travel_score 0.0 - 1.0)
    travel_map = {
        'never': 0.1,
        'occasionally': 0.4,
        'frequently': 0.9
    }

    # Menyusun dictionary features. 
    # PENTING: Kunci (keys) di sini belum tentu urut, nanti diurutkan saat buat DataFrame.
    features = {
        'plan_type': data.get('plan_type', 'Prepaid'),          
        'device_brand': data.get('device_brand', 'Other'),    
        'avg_data_usage_gb': data_usage_map.get(data.get('internet_usage'), 1.0),
        'pct_video_usage': video_map.get(data.get('streaming_freq'), 0.2),
        'avg_call_duration': call_map.get(data.get('call_usage'), 5.0),
        'sms_freq': sms_map.get(data.get('sms_usage'), 5),
        'monthly_spend': budget_map.get(data.get('budget'), 50000),
        'topup_freq': 4,             # Default value (rata-rata)
        'travel_score': travel_map.get(data.get('travel_freq'), 0.1),
        'complaint_count': 0         # User baru diasumsikan belum ada komplain
    }
    
    return features

@app.route('/predict', methods=['POST'])
def predict():
    # Cek apakah model sudah terload
    if model is None:
        return jsonify({'error': 'Model belum dimuat di server.'}), 500

    try:
        # 1. Ambil data JSON dari frontend
        input_data = request.get_json()
        if not input_data:
            return jsonify({'error': 'Tidak ada data input'}), 400

        print("Received input:", input_data) # Debugging

        # 2. Proses data (Mapping dari String -> Angka)
        processed_features = preprocess_input(input_data)

        # 3. Convert ke Pandas DataFrame
        # PENTING: Urutan list ini HARUS SAMA PERSIS dengan urutan kolom saat kamu melatih model (X_train)
        feature_order = [
            'plan_type', 
            'device_brand', 
            'avg_data_usage_gb', 
            'pct_video_usage', 
            'avg_call_duration', 
            'sms_freq', 
            'monthly_spend', 
            'topup_freq', 
            'travel_score', 
            'complaint_count'
        ]
        
        df_input = pd.DataFrame([processed_features], columns=feature_order)

        # 4. Lakukan Prediksi
        # Catatan: Jika model kamu dilatih menggunakan Pipeline (termasuk OneHotEncoder),
        # maka df_input ini aman. Jika model kamu hanya menerima angka murni,
        # kamu akan butuh encoding tambahan di sini untuk 'plan_type' dan 'device_brand'.
        
        prediction_result = model.predict(df_input)
        
        # Ambil hasil prediksi (karena hasil predict berupa array)
        predicted_offer = prediction_result[0]

        return jsonify({
            'status': 'success',
            'predicted_offer': predicted_offer,
            'debug_info': processed_features # Opsional: untuk cek data yang masuk ke model
        })

    except Exception as e:
        print(f"Error during prediction: {e}")
        # Kembalikan error message yang jelas
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)