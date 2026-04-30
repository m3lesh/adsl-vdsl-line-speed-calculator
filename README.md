# 🌐 حاسبة سرعة خط ADSL/VDSL | ADSL/VDSL Line Speed Calculator

---

## 🇮🇶 العربية

حاسبة تفاعلية لتحليل جودة خط الهاتف (ADSL/VDSL) وتحديد ما إذا كان الخط يتحمل رفع السرعة أم لا، معتمدة على القيم المأخوذة من المودم.

### ✨ المميزات
- 📊 تحليل شامل لجودة الخط (Downstream + Upstream)
- 🔄 دعم ADSL/ADSL2+ و VDSL/VDSL2 بعتبات مختلفة
- 🌍 واجهة ثنائية اللغة (عربي/إنكليزي) مع دعم RTL
- 📱 تصميم متجاوب يعمل على الهواتف والحواسيب
- 📲 تطبيق ويب تقدمي (PWA) - يعمل أوفلاين
- ⬇️ زر تثبيت للتثبيت على الشاشة الرئيسية
- 🎨 واجهة حديثة بتأثير Glassmorphism
- 📈 عداد زوار مباشر
- ⚡ تحليل فوري بدون خادم خارجي
- 🔍 SEO متكامل + Open Graph

### 📋 القيم المطلوبة من المودم
| القيمة | الوصف |
|--------|-------|
| Current Rate | السرعة الحالية (kbps) |
| Max Rate | أقصى سرعة ممكنة (kbps) |
| SNR Margin | هامش نسبة الإشارة إلى الضجيج (dB) |
| Line Attenuation | توهين الخط (dB) |
| Errors (CRC) | عدد أخطاء الحزمة |

### 🔢 عتبات التحليل

#### ADSL / ADSL2+
| القياس | ممتاز | جيد | مقبول | ضعيف |
|--------|-------|-----|-------|------|
| SNR Margin | ≥ 15 dB | ≥ 10 dB | ≥ 6 dB | < 6 dB |
| Attenuation | ≤ 20 dB | ≤ 30 dB | ≤ 40 dB | > 40 dB |

#### VDSL / VDSL2
| القياس | ممتاز | جيد | مقبول | ضعيف |
|--------|-------|-----|-------|------|
| SNR Margin | ≥ 18 dB | ≥ 12 dB | ≥ 8 dB | < 8 dB |
| Attenuation | ≤ 10 dB | ≤ 15 dB | ≤ 20 dB | > 20 dB |

### 🛠️ التقنيات
- HTML5 + CSS3 + JavaScript (بدون إطارات عمل)
- [Tailwind CSS](https://tailwindcss.com/) (عبر CDN)
- Google Fonts (Noto Sans Arabic + Inter)
- [hitscounter.dev](https://hitscounter.dev/) لعداد الزوار
- GitHub Actions للنشر التلقائي
- PWA (Service Worker + Web App Manifest)
- SEO كامل (Open Graph, Twitter Card, JSON-LD)

### 🚀 التشغيل المحلي
```bash
# باستخدام npx
npx http-server -p 8080

# أو باستخدام Python
python -m http.server 8080
```
ثم افتح `http://localhost:8080` في المتصفح.

### 📂 هيكل المشروع
```
adsl-vdsl-line-speed-calculator/
├── index.html              # الصفحة الرئيسية
├── css/
│   └── style.css           # الأنماط المخصصة
├── js/
│   ├── app.js              # منطق الحاسبة
│   └── i18n.js             # الترجمة واللغات
├── img/
│   ├── logo.svg            # شعار التطبيق
│   ├── favicon.svg         # أيقونة المتصفح
│   ├── favicon.ico         # أيقونة ICO
│   ├── apple-touch-icon.png # أيقونة Apple
│   └── og-image.png        # صورة Open Graph
├── manifest.json           # إعدادات PWA
├── sw.js                   # Service Worker
├── .github/
│   └── workflows/
│       └── deploy.yml      # نشر GitHub Pages
└── README.md
```

### ⚠️ تنويه
هذه الحاسبة **غير رسمية** ومخصصة للاسترشاد فقط. النتائج تعتمد على عتبات عامة وقد تختلف حسب ظروف الخط الفعلية ومزود الخدمة.

---

## 🇬🇧 English

An interactive calculator to analyze ADSL/VDSL phone line quality and determine whether the line can handle a speed upgrade, based on modem values.

### ✨ Features
- 📊 Comprehensive line quality analysis (Downstream + Upstream)
- 🔄 Support for ADSL/ADSL2+ and VDSL/VDSL2 with different thresholds
- 🌍 Bilingual interface (Arabic/English) with RTL support
- 📱 Responsive design for mobile and desktop
- 📲 Progressive Web App (PWA) - works offline
- ⬇️ Install button for home screen installation
- 🎨 Modern UI with Glassmorphism effect
- 📈 Live visitor counter
- ⚡ Instant client-side analysis (no server required)
- 🔍 Full SEO + Open Graph integration

### 📋 Required Modem Values
| Value | Description |
|-------|-------------|
| Current Rate | Current speed (kbps) |
| Max Rate | Maximum attainable speed (kbps) |
| SNR Margin | Signal-to-Noise Ratio margin (dB) |
| Line Attenuation | Line attenuation (dB) |
| Errors (CRC) | Packet error count |

### 🔢 Analysis Thresholds

#### ADSL / ADSL2+
| Metric | Excellent | Good | Fair | Poor |
|--------|-----------|------|------|------|
| SNR Margin | ≥ 15 dB | ≥ 10 dB | ≥ 6 dB | < 6 dB |
| Attenuation | ≤ 20 dB | ≤ 30 dB | ≤ 40 dB | > 40 dB |

#### VDSL / VDSL2
| Metric | Excellent | Good | Fair | Poor |
|--------|-----------|------|------|------|
| SNR Margin | ≥ 18 dB | ≥ 12 dB | ≥ 8 dB | < 8 dB |
| Attenuation | ≤ 10 dB | ≤ 15 dB | ≤ 20 dB | > 20 dB |

### 🛠️ Tech Stack
- HTML5 + CSS3 + JavaScript (no frameworks)
- [Tailwind CSS](https://tailwindcss.com/) (via CDN)
- Google Fonts (Noto Sans Arabic + Inter)
- [hitscounter.dev](https://hitscounter.dev/) for visitor counter
- GitHub Actions for auto-deployment
- PWA (Service Worker + Web App Manifest)
- Full SEO (Open Graph, Twitter Card, JSON-LD)

### 🚀 Run Locally
```bash
# Using npx
npx http-server -p 8080

# Or using Python
python -m http.server 8080
```
Then open `http://localhost:8080` in your browser.

### 📂 Project Structure
```
adsl-vdsl-line-speed-calculator/
├── index.html              # Main page
├── css/
│   └── style.css           # Custom styles
├── js/
│   ├── app.js              # Calculator logic
│   └── i18n.js             # Translations & i18n
├── img/
│   ├── logo.svg            # App logo
│   ├── favicon.svg         # Browser favicon
│   ├── favicon.ico         # ICO favicon
│   ├── apple-touch-icon.png # Apple touch icon
│   └── og-image.png        # Open Graph image
├── manifest.json           # PWA manifest
├── sw.js                   # Service Worker
├── .github/
│   └── workflows/
│       └── deploy.yml      # GitHub Pages deployment
└── README.md
```

### ⚠️ Disclaimer
This is an **unofficial** calculator for guidance only. Results are based on general thresholds and may vary depending on actual line conditions and ISP.

---

<p align="center">
  Developed with ❤️ by <a href="mailto:INFO@ALBEK.CC">ALBEK</a> | All rights reserved © 2026
</p>
