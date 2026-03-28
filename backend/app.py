# backend/app.py
import pandas as pd
from flask import Flask, request, jsonify
from flask_cors import CORS
from model import run_simulation

app = Flask(__name__)
CORS(app)  # React veya başka frontend'den bağlanabilmek için


@app.route("/", methods=["GET"])
def index():
    return jsonify({"status": "ok", "message": "COSMOS API çalışıyor"})


@app.route("/space-bases", methods=["GET"])
def space_bases():
    try:
        df = pd.read_csv('data/uzay_lojistik_final_veri_seti.csv')
        bases = []
        for i, row in df.iterrows():
            bases.append({
                "id": int(i),
                "name": str(row.get('Region', f'Üs {i}')),
                "country": str(row.get('Country', '')),
                "lat": float(row['Latitude']),
                "lng": float(row['Longitude']),
                "description": str(row.get('Description', '')),
            })
        return jsonify({"bases": bases})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.json

        rocket_idx = data.get("rocket_idx", 0)
        site_idx = data.get("site_idx", 0)

        sonuc = run_simulation(rocket_idx, site_idx)

        # Model çıktısını frontend'in beklediği formata dönüştür
        go = sonuc["FIRLATMA_DURUMU"] == "GO"
        teknik = sonuc["TEKNİK_ANALİZ_RAPORU"]
        meteo = sonuc["METEOROLOJİ_VERİSİ"]
        riskler = sonuc["RİSK_VE_ENGEL_NOTLARI"]

        twr = teknik.get("TWR_Oranı", 0)
        wind_str = str(meteo.get("Rüzgar_Hızı", "0 m/s")).split()[0]
        wind = float(wind_str) if wind_str.replace('.', '').isdigit() else 0.0

        confidence = round(min(99.9, twr * 40), 1) if go else round(max(5.0, twr * 15), 1)
        risk_factor = round(max(0.01, 1.0 / twr) if twr > 0 else 99.0, 2)
        atm_stability = max(0, min(100, int(100 - wind * 4)))
        geo_fit = 88 if go else 42

        summary = (
            riskler if isinstance(riskler, str)
            else " | ".join(riskler) if riskler else "Güvenli fırlatma koşulları sağlandı."
        )

        return jsonify({
            "confidence": confidence,
            "riskFactor": risk_factor,
            "status": "SUCCESS" if go else "NO-GO",
            "atmosphericStability": atm_stability,
            "geopoliticalFit": geo_fit,
            "summary": summary,
            "engineVersion": "Fizik Simülasyon Motoru v1.0",
            "raw": sonuc,
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    print("🚀 Flask API başlatıldı: http://localhost:5000")
    app.run(port=5000, debug=True)
