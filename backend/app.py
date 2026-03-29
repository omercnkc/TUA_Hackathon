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
                "name": str(row.get('Country', f'Üs {i}')),
                "region": str(row.get('Region', '')),
                "lat": float(row['Latitude']),
                "lng": float(row['Longitude']),
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


# Lojistik CSV'deki ülke adı → roket CSV'deki Location son segmenti eşleşmesi
COUNTRY_ALIAS = {
    'United States': 'USA',
    'Kazakhstan':    'Kazakhstan',
    'Russia':        'Russia',
    'China':         'China',
    'France':        'France',
}

@app.route("/history", methods=["GET"])
def history():
    try:
        site_idx = int(request.args.get("site_idx", 0))
        log_df   = pd.read_csv('data/uzay_lojistik_final_veri_seti.csv')
        site     = log_df.iloc[site_idx]
        country  = str(site.get('Country', ''))
        loc_key  = COUNTRY_ALIAS.get(country)

        if not loc_key:
            return jsonify({"no_data": True, "country": country})

        rocket_df = pd.read_csv('data/mission_launches_sized.csv', sep=';', on_bad_lines='skip')
        rocket_df['loc_country'] = rocket_df['Location'].apply(
            lambda x: str(x).strip().split(',')[-1].strip()
        )
        filtered = rocket_df[rocket_df['loc_country'] == loc_key]

        total = len(filtered)
        if total == 0:
            return jsonify({"no_data": True, "country": country})

        counts = filtered['Mission_Status'].value_counts().to_dict()
        success          = counts.get('Success', 0)
        failure          = counts.get('Failure', 0)
        partial_failure  = counts.get('Partial Failure', 0)
        prelaunch_failure= counts.get('Prelaunch Failure', 0)

        return jsonify({
            "no_data":             False,
            "country":             country,
            "total_launches":      total,
            "success_rate":        round(success / total * 100, 1),
            "failure_rate":        round(failure / total * 100, 1),
            "partial_failure_rate":round(partial_failure / total * 100, 1),
            "prelaunch_failure_rate": round(prelaunch_failure / total * 100, 1),
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    print("Flask API baslatildi: http://localhost:5000")
    app.run(port=5000, debug=True)
