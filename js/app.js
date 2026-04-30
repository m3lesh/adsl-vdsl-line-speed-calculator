// Thresholds for ADSL and VDSL
const thresholds = {
    adsl: {
        snr: {
            min: 6,      // Minimum acceptable
            good: 10,    // Good
            excellent: 15 // Excellent
        },
        attenuation: {
            excellent: 20,  // Excellent
            good: 30,       // Good
            max: 40         // Maximum acceptable
        },
        speedGap: {
            min: 1000,      // Minimum gap to consider upgrade (1 Mbps)
            good: 3000,     // Good gap (3 Mbps)
            excellent: 5000 // Excellent gap (5 Mbps)
        }
    },
    vdsl: {
        snr: {
            min: 8,      // VDSL needs higher SNR
            good: 12,    // Good
            excellent: 18 // Excellent
        },
        attenuation: {
            excellent: 10,  // VDSL is more sensitive to attenuation
            good: 15,       // Good
            max: 20         // Maximum acceptable
        },
        speedGap: {
            min: 2000,      // Minimum gap (2 Mbps)
            good: 5000,     // Good gap (5 Mbps)
            excellent: 10000 // Excellent gap (10 Mbps)
        }
    }
};

function getLineType() {
    const selected = document.querySelector('input[name="lineType"]:checked');
    return selected ? selected.value : 'adsl';
}

function getInputValues() {
    function getVal(id) {
        const el = document.getElementById(id);
        const raw = el.value.trim();
        const num = parseFloat(raw);
        // Treat negative values and NaN as no valid input
        const isValid = raw !== '' && !isNaN(num) && num >= 0;
        return { value: isValid ? num : 0, hasInput: isValid };
    }
    return {
        downstream: {
            currentRate: getVal('dsCurrentRate'),
            maxRate: getVal('dsMaxRate'),
            snr: getVal('dsSnr'),
            attenuation: getVal('dsAtten'),
            errors: getVal('dsErrors')
        },
        upstream: {
            currentRate: getVal('usCurrentRate'),
            maxRate: getVal('usMaxRate'),
            snr: getVal('usSnr'),
            attenuation: getVal('usAtten'),
            errors: getVal('usErrors')
        }
    };
}

function analyzeMetric(value, type, metric, hasInput) {
    const lineType = getLineType();
    const thresh = thresholds[lineType][metric];
    
    if (!hasInput) return { status: 'unknown', score: 0, hasInput: false };
    
    if (type === 'snr') {
        if (value >= thresh.excellent) return { status: 'excellent', score: 3, hasInput: true };
        if (value >= thresh.good) return { status: 'good', score: 2, hasInput: true };
        if (value >= thresh.min) return { status: 'fair', score: 1, hasInput: true };
        return { status: 'poor', score: 0, hasInput: true };
    } else if (type === 'attenuation') {
        if (value <= thresh.excellent) return { status: 'excellent', score: 3, hasInput: true };
        if (value <= thresh.good) return { status: 'good', score: 2, hasInput: true };
        if (value <= thresh.max) return { status: 'fair', score: 1, hasInput: true };
        return { status: 'poor', score: 0, hasInput: true };
    } else if (type === 'speedGap') {
        if (value >= thresh.excellent) return { status: 'excellent', score: 3, hasInput: true };
        if (value >= thresh.good) return { status: 'good', score: 2, hasInput: true };
        if (value >= thresh.min) return { status: 'fair', score: 1, hasInput: true };
        return { status: 'poor', score: 0, hasInput: true };
    }
    return { status: 'unknown', score: 0, hasInput: false };
}

function calculateSpeedGap(current, max) {
    if (max <= 0 || current <= 0) return 0;
    const gap = max - current;
    return gap > 0 ? gap : 0;
}

function analyzeErrors(errors, hasInput) {
    if (!hasInput) return { status: 'unknown', score: 0, hasInput: false };
    return {
        status: errors === 0 ? 'excellent' : errors < 10 ? 'good' : errors < 100 ? 'fair' : 'poor',
        score: errors === 0 ? 3 : errors < 10 ? 2 : errors < 100 ? 1 : 0,
        hasInput: true
    };
}

function calculateOverallScore(results) {
    // Weight: SNR (30%), Attenuation (30%), Speed Gap (25%), Errors (15%)
    const weights = {
        snr: 0.30,
        attenuation: 0.30,
        speedGap: 0.25,
        errors: 0.15
    };
    
    let totalScore = 0;
    let maxScore = 0;
    
    ['downstream', 'upstream'].forEach(direction => {
        const r = results[direction];
        // Only count metrics that have valid (non-zero) input
        if (r.snr.score > 0 || r.snr.hasInput) {
            totalScore += r.snr.score * weights.snr;
            maxScore += 3 * weights.snr;
        }
        if (r.attenuation.score > 0 || r.attenuation.hasInput) {
            totalScore += r.attenuation.score * weights.attenuation;
            maxScore += 3 * weights.attenuation;
        }
        if (r.speedGap.score > 0 || r.speedGap.hasInput) {
            totalScore += r.speedGap.score * weights.speedGap;
            maxScore += 3 * weights.speedGap;
        }
        if (r.errors.score > 0 || r.errors.hasInput) {
            totalScore += r.errors.score * weights.errors;
            maxScore += 3 * weights.errors;
        }
    });
    
    // Avoid division by zero
    if (maxScore === 0) return 0;
    
    // Normalize to 0-100 scale
    return (totalScore / maxScore) * 100;
}

function getVerdict(score) {
    if (score >= 80) {
        return {
            status: 'excellent',
            title: t('verdictExcellent'),
            message: t('verdictExcellentDesc'),
            class: 'verdict-good'
        };
    } else if (score >= 60) {
        return {
            status: 'good',
            title: t('verdictGood'),
            message: t('verdictGoodDesc'),
            class: 'verdict-good'
        };
    } else if (score >= 40) {
        return {
            status: 'fair',
            title: t('verdictFair'),
            message: t('verdictFairDesc'),
            class: 'verdict-warning'
        };
    } else {
        return {
            status: 'poor',
            title: t('verdictPoor'),
            message: t('verdictPoorDesc'),
            class: 'verdict-bad'
        };
    }
}

function generateRecommendations(results, score) {
    const recommendations = [];
    
    // Speed upgrade recommendations
    if (score >= 70) {
        recommendations.push(t('recIncreaseSpeed'));
    } else if (score >= 50) {
        recommendations.push(t('recConsiderUpgrade'));
    } else {
        recommendations.push(t('recWait'));
    }
    
    // Check downstream issues
    const ds = results.downstream;
    if (ds.attenuation.status === 'poor') {
        recommendations.push(t('recCheckWiring'));
    }
    if (ds.snr.status === 'poor') {
        recommendations.push(t('recCheckNoise'));
    }
    if (ds.errors.status === 'poor') {
        recommendations.push(t('recContactISP'));
    }
    if (ds.speedGap.status === 'poor' && score < 50) {
        recommendations.push(t('recReduceSpeed'));
    }
    
    // Check upstream issues
    const us = results.upstream;
    if (us.snr.status === 'poor' && ds.snr.status !== 'poor') {
        recommendations.push(t('recCheckNoise'));
    }
    if (us.attenuation.status === 'poor' && ds.attenuation.status !== 'poor') {
        recommendations.push(t('recCheckWiring'));
    }
    if (us.errors.status === 'poor' && ds.errors.status !== 'poor') {
        recommendations.push(t('recContactISP'));
    }
    
    return [...new Set(recommendations)]; // Remove duplicates
}

function getStatusIcon(status) {
    const icons = {
        excellent: '✨',
        good: '✓',
        fair: '⚠️',
        poor: '✗'
    };
    return icons[status] || '?';
}

function getStatusClass(status) {
    const classes = {
        excellent: 'status-good',
        good: 'status-good',
        fair: 'status-warning',
        poor: 'status-bad'
    };
    return classes[status] || '';
}

function getStatusText(status) {
    const texts = {
        excellent: t('metricStatusGood'),
        good: t('metricStatusGood'),
        fair: t('metricStatusWarning'),
        poor: t('metricStatusBad')
    };
    return texts[status] || status;
}

function renderMetricCard(title, value, unit, analysis, direction) {
    if (analysis.status === 'unknown') {
        return `
            <div class="metric-card bg-black/20 border border-gray-700/30 rounded-xl p-4">
                <div class="flex justify-between items-start mb-2">
                    <span class="text-sm text-gray-300">${title}</span>
                    <span class="text-xl text-gray-500">—</span>
                </div>
                <div class="text-2xl font-bold mb-1 text-gray-500">N/A</div>
                <div class="text-sm font-medium text-gray-500">${direction} - ${currentLang === 'ar' ? 'لم يُدخل' : 'Not entered'}</div>
            </div>
        `;
    }
    
    const statusClass = getStatusClass(analysis.status);
    const statusIcon = getStatusIcon(analysis.status);
    const statusText = getStatusText(analysis.status);
    
    return `
        <div class="metric-card ${statusClass} rounded-xl p-4">
            <div class="flex justify-between items-start mb-2">
                <span class="text-sm text-gray-300">${title}</span>
                <span class="text-xl">${statusIcon}</span>
            </div>
            <div class="text-2xl font-bold mb-1">${value} ${unit}</div>
            <div class="text-sm font-medium ${
                analysis.status === 'excellent' || analysis.status === 'good' ? 'text-green-400' : 
                analysis.status === 'fair' ? 'text-yellow-400' : 'text-red-400'
            }">${statusText} - ${direction}</div>
        </div>
    `;
}

function showNotification(message) {
    const notif = document.getElementById('notification');
    const text = document.getElementById('notificationText');
    text.textContent = message;
    notif.classList.remove('hidden');
    notif.scrollIntoView({ behavior: 'smooth', block: 'center' });
    if (notif._timeout) clearTimeout(notif._timeout);
    notif._timeout = setTimeout(() => {
        notif.classList.add('hidden');
    }, 4000);
}

function hideNotification() {
    const notif = document.getElementById('notification');
    if (notif) notif.classList.add('hidden');
}

function analyze() {
    hideNotification();
    const values = getInputValues();
    
    // Validate inputs - check if any field has input
    const hasAnyInput = Object.values(values.downstream).some(v => v.hasInput) ||
                       Object.values(values.upstream).some(v => v.hasInput);
    
    if (!hasAnyInput) {
        showNotification(currentLang === 'ar' ? 'الرجاء إدخال قيم على الأقل' : 'Please enter at least some values');
        return;
    }
    
    // Helper to get speed gap with hasInput
    function getSpeedGap(direction) {
        const cr = values[direction].currentRate;
        const mr = values[direction].maxRate;
        const hasInput = cr.hasInput && mr.hasInput;
        const gap = calculateSpeedGap(cr.value, mr.value);
        return { value: gap, hasInput };
    }
    
    const dsGap = getSpeedGap('downstream');
    const usGap = getSpeedGap('upstream');
    
    // Analyze each metric
    const results = {
        downstream: {
            snr: analyzeMetric(values.downstream.snr.value, 'snr', 'snr', values.downstream.snr.hasInput),
            attenuation: analyzeMetric(values.downstream.attenuation.value, 'attenuation', 'attenuation', values.downstream.attenuation.hasInput),
            speedGap: analyzeMetric(dsGap.value, 'speedGap', 'speedGap', dsGap.hasInput),
            errors: analyzeErrors(values.downstream.errors.value, values.downstream.errors.hasInput)
        },
        upstream: {
            snr: analyzeMetric(values.upstream.snr.value, 'snr', 'snr', values.upstream.snr.hasInput),
            attenuation: analyzeMetric(values.upstream.attenuation.value, 'attenuation', 'attenuation', values.upstream.attenuation.hasInput),
            speedGap: analyzeMetric(usGap.value, 'speedGap', 'speedGap', usGap.hasInput),
            errors: analyzeErrors(values.upstream.errors.value, values.upstream.errors.hasInput)
        }
    };
    
    // Calculate overall score
    const overallScore = calculateOverallScore(results);
    const verdict = getVerdict(overallScore);
    
    // Render results
    document.getElementById('results').classList.remove('hidden');
    
    // Verdict card
    const verdictCard = document.getElementById('verdictCard');
    verdictCard.className = `rounded-2xl p-6 text-center mb-6 ${verdict.class}`;
    document.getElementById('verdictIcon').textContent = 
        verdict.status === 'excellent' ? '✨' : 
        verdict.status === 'good' ? '👍' :
        verdict.status === 'fair' ? '⚠️' : '❌';
    document.getElementById('verdictTitle').textContent = verdict.title;
    document.getElementById('verdictMessage').textContent = verdict.message;
    
    // Metrics grid
    const metricsGrid = document.getElementById('metricsGrid');
    metricsGrid.innerHTML = `
        ${renderMetricCard(t('metricSnr'), values.downstream.snr.value, 'dB', results.downstream.snr, t('downstream'))}
        ${renderMetricCard(t('metricSnr'), values.upstream.snr.value, 'dB', results.upstream.snr, t('upstream'))}
        ${renderMetricCard(t('metricAttenuation'), values.downstream.attenuation.value, 'dB', results.downstream.attenuation, t('downstream'))}
        ${renderMetricCard(t('metricAttenuation'), values.upstream.attenuation.value, 'dB', results.upstream.attenuation, t('upstream'))}
        ${renderMetricCard(t('metricSpeedGap'), dsGap.value, 'kbps', results.downstream.speedGap, t('downstream'))}
        ${renderMetricCard(t('metricSpeedGap'), usGap.value, 'kbps', results.upstream.speedGap, t('upstream'))}
        ${renderMetricCard(t('metricErrors'), values.downstream.errors.value, 'errors', results.downstream.errors, t('downstream'))}
        ${renderMetricCard(t('metricErrors'), values.upstream.errors.value, 'errors', results.upstream.errors, t('upstream'))}
    `;
    
    // Recommendations
    const recommendations = generateRecommendations(results, overallScore);
    document.getElementById('recommendationsList').innerHTML = 
        recommendations.map(rec => `<li class="flex items-start gap-3 p-3 bg-black/20 rounded-lg">${rec}</li>`).join('');
    
    // Scroll to results
    document.getElementById('results').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Visitor Counter using hitscounter.dev API
function initVisitorCounter() {
    const apiUrl = "https://hitscounter.dev/api/hit?output=json&url=https%3A%2F%2Fm3lesh.github.io%2Fadsl-vdsl-line-speed-calculator%2F&tz=Turkey";
    
    async function fetchVisitorCount() {
        try {
            const response = await fetch(apiUrl, {
                cache: "no-store"
            });

            if (!response.ok) {
                throw new Error("API request failed");
            }

            const data = await response.json();

            document.getElementById('totalVisitors').textContent = data.total_hits.toLocaleString("en-US");
            document.getElementById('todayVisitors').textContent = data.today_hits.toLocaleString("en-US");
        } catch (error) {
            console.error("Failed to fetch visitor count:", error);
            document.getElementById('totalVisitors').textContent = "N/A";
            document.getElementById('todayVisitors').textContent = "N/A";
        }
    }

    fetchVisitorCount();
}

// Dynamic Year
function setCurrentYear() {
    const yearElement = document.getElementById('currentYear');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const calculateBtn = document.getElementById('calculateBtn');
    if (calculateBtn) {
        calculateBtn.addEventListener('click', analyze);
    }
    
    // Also allow Enter key to calculate
    document.querySelectorAll('input[type="number"]').forEach(input => {
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                analyze();
            }
        });
    });
    
    // Initialize visitor counter
    initVisitorCounter();
    
    // Set dynamic year
    setCurrentYear();
});
