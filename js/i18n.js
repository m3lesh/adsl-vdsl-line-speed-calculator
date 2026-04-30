const translations = {
    ar: {
        pageTitle: "حاسبة سرعة خط ADSL/VDSL",
        subtitle: "هل يتحمل خطك رفع السرعة؟ أدخل قيم المودم لتحليل جودة الخط",
        lineType: "نوع الخط",
        downstream: "Downstream (التحميل)",
        upstream: "Upstream (الرفع)",
        currentRate: "Current Rate (kbps) - السرعة الحالية",
        maxRate: "Max Rate (kbps) - أقصى سرعة ممكنة",
        snrMargin: "SNR Margin (dB) - هامش نسبة الإشارة",
        lineAttenuation: "Line Attenuation (dB) - توهين الخط",
        errors: "Errors (CRC) - عدد الأخطاء",
        calculateBtn: "تحليل الخط و التوصية",
        analysisResult: "نتيجة التحليل",
        recommendations: "التوصيات",
        footer: "حاسبة غير رسمية - للاسترشاد فقط",
        
        // Verdicts
        verdictExcellent: "ممتاز! ✨",
        verdictGood: "جيد 👍",
        verdictFair: "مقبول ⚠️",
        verdictPoor: "ضعيف ❌",
        
        verdictExcellentDesc: "خطك يتحمل رفع السرعة بسهولة",
        verdictGoodDesc: "خطك يتحمل رفع السرعة مع احتياط",
        verdictFairDesc: "خطك على الحد الأدنى - احذر من رفع السرعة",
        verdictPoorDesc: "خطك لا يتحمل رفع السرعة حالياً",
        
        // Metrics
        metricSnr: "نسبة الإشارة إلى الضجيج",
        metricAttenuation: "توهين الخط",
        metricSpeedGap: "هامش السرعة المتاح",
        metricErrors: "معدل الأخطاء",
        
        metricStatusGood: "ممتاز",
        metricStatusWarning: "متوسط",
        metricStatusBad: "ضعيف",
        
        // Recommendations
        recIncreaseSpeed: "✅ يمكنك رفع السرعة بأمان",
        recConsiderUpgrade: "⚠️ فكر في رفع السرعة بحذر",
        recWait: "⏳ انتظر تحسن الظروف قبل رفع السرعة",
        recCheckWiring: "🔧 افحص توصيلات الخط - قد تكون هناك مشاكل في الأسلاك",
        recContactISP: "📞 تواصل مع مزود الخدمة لفحص الخط",
        recReduceSpeed: "⚠️ قد تحتاج لخفض السرعة للاستقرار",
        recCheckNoise: "🔇 تحقق من مصادر الضوضاء الإلكترونية",
        
        // Line type labels
        adslLabel: "ADSL / ADSL2+",
        vdslLabel: "VDSL / VDSL2",
        
        // Footer
        developedBy: "تم التطوير بـ ❤️ بواسطة ALBEK",
        copyright: "جميع الحقوق محفوظة ©",
        totalVisitors: "إجمالي الزوار",
        todayVisitors: "زوار اليوم",
        contactNote: "للملاحظات أو الأخطاء يرجى التواصل معنا:",
    },
    en: {
        pageTitle: "ADSL/VDSL Line Speed Calculator",
        subtitle: "Can your line handle higher speeds? Enter your modem values for line quality analysis",
        lineType: "Line Type",
        downstream: "Downstream",
        upstream: "Upstream",
        currentRate: "Current Rate (kbps)",
        maxRate: "Max Rate (kbps)",
        snrMargin: "SNR Margin (dB)",
        lineAttenuation: "Line Attenuation (dB)",
        errors: "Errors (CRC)",
        calculateBtn: "Analyze Line & Get Recommendations",
        analysisResult: "Analysis Result",
        recommendations: "Recommendations",
        footer: "Unofficial calculator - for guidance only",
        
        // Verdicts
        verdictExcellent: "Excellent! ✨",
        verdictGood: "Good 👍",
        verdictFair: "Fair ⚠️",
        verdictPoor: "Poor ❌",
        
        verdictExcellentDesc: "Your line can easily handle higher speeds",
        verdictGoodDesc: "Your line can handle higher speeds with caution",
        verdictFairDesc: "Your line is at minimum threshold - be careful with speed increases",
        verdictPoorDesc: "Your line cannot handle higher speeds currently",
        
        // Metrics
        metricSnr: "Signal-to-Noise Ratio",
        metricAttenuation: "Line Attenuation",
        metricSpeedGap: "Available Speed Headroom",
        metricErrors: "Error Rate",
        
        metricStatusGood: "Good",
        metricStatusWarning: "Fair",
        metricStatusBad: "Poor",
        
        // Recommendations
        recIncreaseSpeed: "✅ You can safely increase speed",
        recConsiderUpgrade: "⚠️ Consider upgrading speed with caution",
        recWait: "⏳ Wait for conditions to improve before increasing speed",
        recCheckWiring: "🔧 Check line wiring - there may be wiring issues",
        recContactISP: "📞 Contact your ISP to check the line",
        recReduceSpeed: "⚠️ You may need to reduce speed for stability",
        recCheckNoise: "🔇 Check for electronic noise sources",
        
        // Line type labels
        adslLabel: "ADSL / ADSL2+",
        vdslLabel: "VDSL / VDSL2",
        
        // Footer
        developedBy: "Developed with ❤️ by ALBEK",
        copyright: "All rights reserved ©",
        totalVisitors: "Total Visitors",
        todayVisitors: "Today's Visitors",
        contactNote: "For notes or errors, please contact us:",
    }
};

let currentLang = 'ar';

function toggleLanguage() {
    currentLang = currentLang === 'ar' ? 'en' : 'ar';
    document.documentElement.lang = currentLang;
    document.documentElement.dir = currentLang === 'ar' ? 'rtl' : 'ltr';
    
    const langToggle = document.getElementById('langToggle');
    if (langToggle) {
        langToggle.textContent = currentLang === 'ar' ? 'English' : 'عربي';
    }
    
    updatePageText();
}

function updatePageText() {
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[currentLang][key]) {
            el.textContent = translations[currentLang][key];
        }
    });
}

function t(key) {
    return translations[currentLang][key] || key;
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    const langToggle = document.getElementById('langToggle');
    if (langToggle) {
        langToggle.addEventListener('click', toggleLanguage);
    }
});
