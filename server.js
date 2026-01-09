const express = require('express');
const app = express();

// =========================================================
// PHẦN 1: MỒI NHỬ CHO SAST (QUÉT TĨNH - TRIVY)
// Mục tiêu: Trivy quét file này sẽ thấy các chuỗi bí mật bị lộ
// =========================================================

// Lỗi: Hardcoded Secrets (Lộ khóa AWS) -> Trivy sẽ báo Severity: CRITICAL
const AWS_ACCESS_KEY_ID = "AKIAIO5FODNN7EXAMPLE"; 
const AWS_SECRET_ACCESS_KEY = "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY";

// Lỗi: Hardcoded Secrets (Lộ Github Token) -> Trivy sẽ báo Severity: CRITICAL
const GITHUB_TOKEN = "ghp_R52342345234523452345234523452345234"; 

// =========================================================
// PHẦN 2: MỒI NHỬ CHO DAST (QUÉT ĐỘNG - OWASP ZAP)
// Mục tiêu: ZAP tấn công vào web đang chạy sẽ thấy lỗi XSS
// =========================================================

app.get('/', (req, res) => {
    // Lấy tham số 'name' từ đường dẫn URL (ví dụ: localhost/?name=Hacker)
    const name = req.query.name || 'Admin';

    // LỖ HỔNG XSS (Reflected Cross-Site Scripting)
    // Code này lấy input của người dùng và in thẳng ra HTML mà không qua lọc (Sanitize).
    // Nếu Hacker gửi: localhost/?name=<script>alert('Hacked')</script>
    // Trình duyệt sẽ chạy đoạn script đó ngay lập tức.
    
    const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Vulnerable App</title>
            <style>
                body { font-family: sans-serif; text-align: center; padding-top: 50px; }
                h1 { color: red; }
            </style>
        </head>
        <body>
            <h1>DEMO DEVSECOPS - DO AN NANG CAO</h1>
            <h3>Chao mung: ${name}</h3> 
            <p>Trang web nay chua lo hong bao mat de demo CI/CD.</p>
        </body>
        </html>
    `;

    res.send(htmlContent);
});

// Chạy server tại cổng 80
app.listen(80, () => {
    console.log('Vulnerable App is running on port 80...');
});