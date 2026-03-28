# TUA Hackathon — Advanced Rocket Simulation Engine 🚀

Bu proje, Türkiye Uzay Ajansı (TUA) Hackathon kapsamında geliştirilmiş, yüksek doğruluklu bir roket fırlatma ve uçuş simülasyon motorudur. Gerçek fizik kuralları ve gelişmiş telemetri sistemleri üzerine inşa edilmiştir.

![Rocket Simulation Dashboard](./screenshot.png)

## 🌟 Ana Özellikler

### 1. Dinamik Fizik Motoru
- **Variable Mass Physics**: Yakıt tüketildikçe roketin kütlesi anlık olarak azalır, bu da ivmenin (F/m) gerçekçi şekilde artmasını sağlar.
- **Atmospheric Drag**: İrtifa arttıkça değişen hava yoğunluğu ($ρ = ρ₀ \cdot e^{-h/H}$) ve hıza bağlı sürtünme kuvveti hesaplanır.
- **Launchpad Logic**: Ateşleme anında itki yerçekimini yenene kadar roketin rampada güvenli beklemesi sağlanır.

### 2. Gelişmiş İtki Sistemi (Thrust Curve)
Statik itki yerine, gerçek motor davranışlarını taklit eden 3 fazlı bir model kullanılır:
- **Ramp-up**: Ateşleme anındaki kademeli güç artışı.
- **Steady State**: Ana yanma fazı.
- **Tail-off**: Yakıt biterken itkinin sönümlenmesi.

### 3. Görev ve Puanlama Sistemi (Mission Scoring)
- **Scenarios**: "Reach 50km", "Heavy Payload" gibi farklı görev hedefleri.
- **Performance Rating**: Uçuş sonunda **S, A, B, C, D** rütbeleri ile performans değerlendirmesi.
- **Score Breakdown**: İrtifa başarısı, yakıt verimliliği, iniş sertliği ve uçuş stabilitesi bazlı detaylı skor dökümü.

### 4. Profesyonel Kontrol Katmanı
- **Playback Controls**: Simülasyonu duraklatma (Pause), devam ettirme (Resume) ve resetleme.
- **Time Scaling**: 0.1x (Yavaş çekim) ile 10x (Turbo) arası hız ayarı.
- **Single-Step**: Fizik motorunu kare kare (0.01s) ilerleterek hata ayıklama desteği.

### 5. Telemetri ve Analiz
- **Real-time Charts**: Yükseklik, Hız, İtki ve Yakıt grafiklerinin anlık takibi.
- **Run Comparison Dashboard**: Son iki uçuşun grafiklerini üst üste bindirerek (overlap) performans farklarını analiz etme.
- **Persistence**: Tüm ayarlar ve geçmiş uçuş verileri `localStorage` ile tarayıcıda saklanır; sayfa yenilense de veriler kaybolmaz.
- **CSV Export**: Uçuş verilerini `.csv` formatında dışa aktarma desteği.

## 🛠 Teknoloji Yığını
- **Frontend**: React.js, Vanilla CSS
- **Visuals**: Three.js (3D Scene), Recharts (Telemetry)
- **Physics**: Custom Differential Integration Engine (60 FPS / DT=0.016)

## 🚀 Başlangıç

Projeyi yerel ortamınızda çalıştırmak için:

1. Bağımlılıkları yükleyin:
   ```bash
   npm install
   ```

2. Geliştirme sunucusunu başlatın:
   ```bash
   npm run dev
   ```

3. Tarayıcıda `http://localhost:5173` adresine giderek motoru test edin.

## ⚖️ Fiziksel Doğrulama
Uçuş verileri manuel formüller ($a = (T - F_g - F_d) / m$) ile test edilmiş olup, hata payı ihmal edilebilir düzeydedir.

---
*Geliştirici: Antigravity*
