# 🚀 TUA Hackathon: 3D Rocket Launch Simulation

Bu proje, Türkiye Uzay Ajansı (TUA) Hackathon kapsamında geliştirilen, yüksek doğruluklu ve gerçekçi bir **3D Roket Fırlatma Simülasyonu**dur. Web teknolojileri kullanılarak geliştirilen simülasyon; gerçekçi fiziksel görselleştirme, dinamik telemetri verileri ve senkronize ses efektleri sunar.

![Uygulama Ekran Görüntüsü](screenshot.png) <!-- Buraya kendi ekran görüntünü screenshot.png ismiyle ekleyebilirsin -->

## 🌟 Öne Çıkan Özellikler

### 1. Yüksek Kaliteli 3D Çevre (Environment)
- **HDR Gökyüzü:** Gerçek dünya ışıklandırması ve bulut dinamikleri için HDR gökyüzü (Skybox) entegrasyonu.
- **Gerçekçi Dokular:** Fotogrametrik çimen dokuları ve ızgara/leke detaylı gerçekçi beton fırlatma platformu.
- **Dinamik Kamera:** Roketi fırlatma anından itibaren otomatik olarak takip eden, ancak aynı zamanda kullanıcının sahnede serbestçe dönmesine izin veren akıllı kamera sistemi.

### 2. Gelişmiş Telemetri & HUD (Arayüz)
- **Tactical UI:** Cyberpunk ve askeri arayüzlerden esinlenilen, düşük gecikmeli HUD paneli.
- **Gerçek Zamanlı Veri:** İrtifa (Altitude), Hız (Velocity) ve Yakıt Durumu (Fuel) verilerinin dinamik takibi.
- **Senkronize Geri Sayım:** T-3'ten itibaren başlayan ve fırlatma anına kadar devam eden görsel/işitsel uyarılar.

### 3. Ses ve Görsel Efektler (VFX/SFX)
- **Senkron Sesler:** Geri sayım sırasında her saniye bipleme ve T-0 anında devreye giren devasa roket motoru sesi.
- **Partikül Sistemi:** Fırlatma anında oluşan dinamik duman ve ateş efektleri.
- **Bloom Efekti:** Motor alevlerinin ve arayüz ışıklarının gerçekçi parlaması için Post-Processing efektleri.

## 🛠️ Kullanılan Teknolojiler

- **Core:** [React](https://reactjs.org/)
- **3D Engine:** [Three.js](https://threejs.org/) & [React Three Fiber](https://docs.pmnd.rs/react-three-fiber/)
- **3D Helpers:** [Drei](https://github.com/pmnd.rs/drei)
- **Animasyon:** [GSAP (GreenSock)](https://greensock.com/gsap/)
- **Görsel Kalite:** [Post-processing](https://github.com/pmnd.rs/postprocessing)
- **Modelleme:** GLTF/GLB tabanlı roket ve kule modelleri.

## 🚀 Kurulum ve Çalıştırma

Projeyi yerel makinenizde çalıştırmak için:

1. Depoyu klonlayın:
   ```bash
   git clone https://github.com/omercnkc/TUA_Hackathon.git
   ```
2. Proje dizinine gidin:
   ```bash
   cd TUA_Hackathon
   ```
3. Gerekli kütüphaneleri yükleyin:
   ```bash
   npm install
   ```
4. Geliştirme sunucusunu başlatın:
   ```bash
   npm run dev
   ```

## 🎮 Kullanım
- **IGNITION:** Geri sayımı ve fırlatma sürecini başlatır.
- **ABORT:** Süreci sıfırlar ve roketi fırlatma padine geri döndürür.
- **Mouse/Touch:** Sahnede dönmek ve zum yapmak için kullanılır.

---
*Bu proje TUA Hackathon heyecanıyla geliştirilmiştir.* 🇹🇷🚀
