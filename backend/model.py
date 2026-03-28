import pandas as pd
import requests

# Sabitler (NASA Standartları)
G_0 = 9.80665
ISP_DEFAULT = 311  # Merlin 1D (s)

def clean_rocket_value(val):
    """Birimleri (kN, kg) temizler, kN'yi N'ye çevirir ve sayıya dönüştürür.
    CSV'deki virgül binlik ayraç olarak kullanılıyor (ör: 7,607 kN → 7607 kN).
    """
    if pd.isna(val) or val == '' or val == 'nan': return 0.0
    s = str(val).lower()
    multiplier = 1000.0 if 'kn' in s else 1.0
    # Virgülü kaldır (binlik ayraç), noktayı ondalık olarak bırak
    cleaned = "".join(c for c in s if c.isdigit() or c in ".,")
    cleaned = cleaned.replace(',', '')  # binlik ayraç virgülü sil
    try:
        return float(cleaned) * multiplier
    except:
        return 0.0

def run_simulation(rocket_idx, site_idx):
    # 1. Veri Yükleme
    rocket_df = pd.read_csv('data/mission_launches_sized.csv', sep=';', on_bad_lines='skip')
    logistics_df = pd.read_csv('data/uzay_lojistik_final_veri_seti.csv')

    r = rocket_df.iloc[rocket_idx]
    s = logistics_df.iloc[site_idx]

    # 2. Roket verileri — temizle ve dönüştür
    thrust   = clean_rocket_value(r['Thrust'])
    dry_mass = clean_rocket_value(r['Dry_Mass'])
    payload  = clean_rocket_value(r['Payload_to_LEO'])

    if thrust   == 0: thrust   = 7_600_000
    if dry_mass == 0: dry_mass = 500_000
    m0 = dry_mass + payload

    # 3. Lojistik CSV'den saha verileri
    lat            = float(s['Latitude'])
    lng            = float(s['Longitude'])
    elevation      = float(s.get('Elevation', 0) or 0)
    ekvator_skoru  = float(s.get('Ekvator_Skoru', 5) or 5)
    basari_yuzdesi = float(s.get('Basari_Yuzdesi', 0.9) or 0.9)
    guvenilirlik   = float(s.get('Guvenilirlik_Puani', 7) or 7)
    toplam_atis    = int(s.get('Toplam_Atis', 0) or 0)

    # 4. Hava durumu — seçilen sahanın koordinatlarıyla
    try:
        url = (
            f"http://api.openweathermap.org/data/2.5/weather"
            f"?lat={lat}&lon={lng}"
            f"&appid=3e39e7ab53c58c7fa47550f5e6711b29&units=metric"
        )
        res  = requests.get(url, timeout=5).json()
        temp_c   = round(res['main']['temp'], 1)
        temp_k   = temp_c + 273.15
        pressure = res['main']['pressure'] * 100   # Pa
        rho      = pressure / (287.05 * temp_k)
        wind     = res['wind']['speed']
    except:
        # Yüksekliğe göre standart atmosfer yaklaşımı
        temp_c = None
        temp_k = 288.15 - 0.0065 * elevation
        pressure = 101325 * (temp_k / 288.15) ** 5.2561
        rho  = pressure / (287.05 * temp_k)
        wind = 5.0

    # 5. NASA Fizik Formülleri
    twr     = thrust / (m0 * G_0) if m0 > 0 else 0
    v       = 180
    max_q   = 0.5 * rho * (v ** 2)
    # Not: CSV'deki Dry_Mass wet mass (kalkış kütlesi), yakıt kütlesi ayrı yok.
    # Delta-v bu veri setiyle doğru hesaplanamıyor → N/A gösteriliyor.

    # 6. Karar Mekanizması — roket + saha verileri birlikte değerlendirilir
    reasons = []

    if twr < 1.05:
        reasons.append(f"Düşük TWR ({round(twr, 2)}): Kalkış imkansız.")

    if max_q > 55000:
        reasons.append(f"Kritik Dinamik Basınç ({int(max_q)} Pa): Yapısal hasar riski.")

    if wind > 15:
        reasons.append(f"Kritik Rüzgar ({wind} m/s): Fırlatma güvenli değil.")

    if ekvator_skoru < 4:
        reasons.append(f"Düşük Ekvator Skoru ({ekvator_skoru}): Yörünge verimliliği düşük.")

    if basari_yuzdesi < 0.75:
        reasons.append(f"Düşük Saha Başarı Oranı (%{round(basari_yuzdesi * 100, 1)}): Risk yüksek.")

    # 7. Çıktı
    output = {
        "FIRLATMA_DURUMU": "GO" if not reasons else "NO-GO",
        "GÖREV_BİLGİLERİ": {
            "Operatör": str(r['Organisation']),
            "Roket": str(r['Detail']),
            "Fırlatma_Sahas": f"{s['Region']} - {s['Country']}",
        },
        "TEKNİK_ANALİZ_RAPORU": {
            "TWR_Oranı": round(twr, 2),
            "Delta_v_Kapasitesi": "N/A",
            "Max_Q_Basıncı": f"{int(max_q)} Pa",
            "İtki_Kuvveti_N": f"{int(thrust)} N",
            "Kalkış_Ağırlığı_kg": f"{int(m0)} kg",
        },
        "SAHA_ANALİZİ": {
            "Ekvator_Skoru": round(ekvator_skoru, 2),
            "Basari_Yuzdesi": f"%{round(basari_yuzdesi * 100, 1)}",
            "Guvenilirlik_Puani": round(guvenilirlik, 2),
            "Toplam_Atis": toplam_atis,
            "Rakım_m": round(elevation, 1),
        },
        "METEOROLOJİ_VERİSİ": {
            "Sicaklik_C": temp_c,
            "Hava_Yoğunluğu_rho": round(rho, 4),
            "Rüzgar_Hızı": f"{wind} m/s",
        },
        "RİSK_VE_ENGEL_NOTLARI": reasons if reasons else "Güvenli fırlatma koşulları sağlandı.",
    }

    return output
