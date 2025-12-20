// Firebase SDK imports (using CDN modules)
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getMessaging, getToken, onMessage } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging.js';

// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyDNnPhIWnN3ThZvzMiOEoqug_TY63YKNns",
    authDomain: "volunteerhub-af843.firebaseapp.com",
    projectId: "volunteerhub-af843",
    storageBucket: "volunteerhub-af843.firebasestorage.app",
    messagingSenderId: "385131798352",
    appId: "1:385131798352:web:0b8873ebef82606df41655"
};

const VAPID_KEY = "BBIbQEAcb52Zp-Wk2kX0DzzXgyZqyIej8VTlhXymc3TGcReWFWO0pXoOkTWNExkTBXb5_UNqOrOoflqiIYLCEiY";
const API_BASE = "http://localhost:8080/api";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

// State
let jwtToken = null;
let fcmToken = null;

// Utility functions
function log(message, type = 'info') {
    const logsDiv = document.getElementById('logs');
    const time = new Date().toLocaleTimeString();
    const entry = document.createElement('div');
    entry.className = `log-entry log-${type}`;
    entry.innerHTML = `<span class="log-time">[${time}]</span> ${message}`;
    logsDiv.insertBefore(entry, logsDiv.firstChild);
    console.log(`[${type.toUpperCase()}]`, message);
}

function showResult(elementId, message, isSuccess) {
    const el = document.getElementById(elementId);
    el.textContent = message;
    el.className = `result ${isSuccess ? 'success' : 'error'}`;
}

function updateLoginStatus(loggedIn) {
    const statusEl = document.getElementById('login-status');
    statusEl.textContent = loggedIn ? '✅ Đã đăng nhập' : '❌ Chưa đăng nhập';

    // Enable/disable buttons based on login status
    document.getElementById('btn-subscribe').disabled = !loggedIn;
    document.getElementById('btn-unsubscribe').disabled = !loggedIn;
    document.getElementById('btn-unsubscribe-all').disabled = !loggedIn;
    document.getElementById('btn-join-event').disabled = !loggedIn;
    document.getElementById('btn-request-manager').disabled = !loggedIn;
    document.getElementById('btn-send-notif').disabled = !loggedIn;
}

function updateFCMStatus(subscribed) {
    const statusEl = document.getElementById('fcm-status');
    statusEl.textContent = subscribed ? '✅ Đã subscribe FCM' : '❌ Chưa subscribe FCM';
}

async function apiCall(endpoint, method = 'GET', body = null) {
    const headers = {
        'Content-Type': 'application/json'
    };

    if (jwtToken) {
        headers['Authorization'] = `Bearer ${jwtToken}`;
    }

    const options = { method, headers };
    if (body) {
        options.body = JSON.stringify(body);
    }

    log(`API ${method} ${endpoint}`, 'info');
    if (jwtToken) {
        log(`Authorization: Bearer ${jwtToken.substring(0, 30)}...`, 'info');
    } else {
        log('⚠️ Không có JWT token - request sẽ bị 403!', 'warn');
    }

    const response = await fetch(`${API_BASE}${endpoint}`, options);
    const text = await response.text();

    let data;
    try {
        data = JSON.parse(text);
    } catch {
        data = text;
    }

    if (!response.ok) {
        throw new Error(data.message || data.error || text || `HTTP ${response.status}`);
    }

    return data;
}

// Login function
window.login = async function () {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (!username || !password) {
        showResult('login-result', 'Vui lòng nhập username và password', false);
        return;
    }

    try {
        log('Đang đăng nhập...', 'info');
        const result = await apiCall('/auth/login', 'POST', {
            usernameOrEmail: username,
            password: password
        });

        jwtToken = result.token;
        localStorage.setItem('jwtToken', jwtToken);

        updateLoginStatus(true);
        showResult('login-result', 'Đăng nhập thành công!', true);
        log('Đăng nhập thành công!', 'success');
    } catch (error) {
        showResult('login-result', `Lỗi: ${error.message}`, false);
        log(`Đăng nhập thất bại: ${error.message}`, 'error');
    }
};

// Subscribe FCM
window.subscribeFCM = async function () {
    try {
        log('Đang xin quyền notification...', 'info');

        // Register service worker first - use relative path
        const swPath = new URL('./firebase-messaging-sw.js', window.location.href).pathname;
        log(`Đường dẫn Service Worker: ${swPath}`, 'info');
        const registration = await navigator.serviceWorker.register(swPath);
        log('Service Worker đã đăng ký', 'success');

        // Request notification permission and get token
        const token = await getToken(messaging, {
            vapidKey: VAPID_KEY,
            serviceWorkerRegistration: registration
        });

        if (!token) {
            throw new Error('Không lấy được FCM token. Hãy kiểm tra quyền notification.');
        }

        fcmToken = token;
        log(`FCM Token: ${token.substring(0, 50)}...`, 'success');

        // Display token
        const tokenDisplay = document.getElementById('fcm-token-display');
        tokenDisplay.textContent = `FCM Token:\n${token}`;
        tokenDisplay.classList.add('show');

        // Send token to backend
        await apiCall('/push-notifications/subscribe', 'POST', { token: token });

        updateFCMStatus(true);
        showResult('fcm-result', 'Subscribe thành công! Token đã được gửi lên server.', true);
        log('Subscribe FCM thành công!', 'success');

    } catch (error) {
        showResult('fcm-result', `Lỗi: ${error.message}`, false);
        log(`Subscribe FCM thất bại: ${error.message}`, 'error');
    }
};

// Unsubscribe FCM
window.unsubscribeFCM = async function () {
    if (!fcmToken) {
        showResult('fcm-result', 'Chưa có FCM token để unsubscribe', false);
        return;
    }

    try {
        await apiCall('/push-notifications/unsubscribe', 'DELETE', { token: fcmToken });

        updateFCMStatus(false);
        fcmToken = null;
        document.getElementById('fcm-token-display').classList.remove('show');
        showResult('fcm-result', 'Unsubscribe thành công!', true);
        log('Unsubscribe FCM thành công!', 'success');
    } catch (error) {
        showResult('fcm-result', `Lỗi: ${error.message}`, false);
        log(`Unsubscribe FCM thất bại: ${error.message}`, 'error');
    }
};

// Unsubscribe All FCM tokens
window.unsubscribeAllFCM = async function () {
    try {
        await apiCall('/push-notifications/unsubscribe-all', 'DELETE');

        updateFCMStatus(false);
        fcmToken = null;
        document.getElementById('fcm-token-display').classList.remove('show');
        showResult('fcm-result', 'Unsubscribe All thành công!', true);
        log('Unsubscribe All FCM thành công!', 'success');
    } catch (error) {
        showResult('fcm-result', `Lỗi: ${error.message}`, false);
        log(`Unsubscribe All FCM thất bại: ${error.message}`, 'error');
    }
};

// Join Event
window.joinEvent = async function () {
    const eventId = document.getElementById('event-id').value;
    const note = document.getElementById('event-note').value;

    if (!eventId) {
        showResult('event-result', 'Vui lòng nhập Event ID', false);
        return;
    }

    try {
        log(`Đang đăng ký event ${eventId}...`, 'info');
        const result = await apiCall(`/me/events/${eventId}/register`, 'POST', {
            note: note || null
        });

        showResult('event-result', `Đăng ký thành công!\n${JSON.stringify(result, null, 2)}`, true);
        log(`Đăng ký event ${eventId} thành công!`, 'success');
    } catch (error) {
        showResult('event-result', `Lỗi: ${error.message}`, false);
        log(`Đăng ký event thất bại: ${error.message}`, 'error');
    }
};

// Request Manager
window.requestManager = async function () {
    const reason = document.getElementById('request-reason').value;

    if (!reason) {
        showResult('request-result', 'Vui lòng nhập lý do', false);
        return;
    }

    try {
        log('Đang gửi request làm manager...', 'info');
        const result = await apiCall('/requests', 'POST', { reason: reason });

        showResult('request-result', `Gửi request thành công!\n${JSON.stringify(result, null, 2)}`, true);
        log('Gửi request làm manager thành công!', 'success');
    } catch (error) {
        showResult('request-result', `Lỗi: ${error.message}`, false);
        log(`Gửi request thất bại: ${error.message}`, 'error');
    }
};

// Send test notification
window.sendTestNotification = async function () {
    const content = document.getElementById('notif-content').value;

    if (!content) {
        showResult('notif-result', 'Vui lòng nhập nội dung', false);
        return;
    }

    try {
        log('Đang gửi test notification...', 'info');
        await apiCall(`/push-notifications/send?content=${encodeURIComponent(content)}`, 'POST');

        showResult('notif-result', 'Đã gửi notification! Kiểm tra trình duyệt.', true);
        log('Gửi test notification thành công!', 'success');
    } catch (error) {
        showResult('notif-result', `Lỗi: ${error.message}`, false);
        log(`Gửi notification thất bại: ${error.message}`, 'error');
    }
};

// Clear logs
window.clearLogs = function () {
    document.getElementById('logs').innerHTML = '';
};

// Listen for foreground messages
onMessage(messaging, (payload) => {
    log(`📬 Nhận notification: ${JSON.stringify(payload.data)}`, 'success');

    // Show browser notification
    if (Notification.permission === 'granted') {
        new Notification('VolunteerHub', {
            body: payload.data?.content || 'New notification',
            icon: '/favicon.ico'
        });
    }
});

// Initialize on page load
window.addEventListener('DOMContentLoaded', () => {
    log('FCM Test App đã khởi động', 'info');

    // Check for saved JWT token
    const savedToken = localStorage.getItem('jwtToken');
    if (savedToken) {
        jwtToken = savedToken;
        updateLoginStatus(true);
        log('Đã khôi phục phiên đăng nhập từ localStorage', 'info');
    }

    // Check notification permission status
    if ('Notification' in window) {
        log(`Notification permission: ${Notification.permission}`, 'info');
    }
});
