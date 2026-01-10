const express = require('express');
const app = express();

// =========================================================
// PHẦN 1: MỒI NHỬ CHO SAST (QUÉT TĨNH - TRIVY)
// =========================================================
// Lỗi lộ khóa RSA
const db_private_key = `-----BEGIN RSA PRIVATE KEY-----
MIIEogIBAAKCAQEA4ilq7+iF8UjS2kV5Y2w6sYjFz1nE2x5p6lX1H6vJz
-----END RSA PRIVATE KEY-----`;

// Lỗi: Lộ Github Token
const GITHUB_TOKEN = "ghp_R52342345234523452345234523452345234";

// =========================================================
// PHẦN 2: MỒI NHỬ CHO DAST (QUÉT ĐỘNG - OWASP ZAP)
// =========================================================

app.get('/', (req, res) => {
    // 1. LỖI COOKIE KHÔNG AN TOÀN (Insecure Cookie)
    // ZAP sẽ báo: "Cookie No HttpOnly Flag" và "Cookie Without Secure Flag"
    // Giải thích: Cookie này có thể bị Javascript độc hại đọc được (do thiếu httpOnly).
    res.cookie('session_id', 'admin_secret_12345', { 
        httpOnly: false, // Lỗi: Cho phép JS đọc cookie
        secure: false    // Lỗi: Truyền qua HTTP thường
    });

    // 2. LỖI XSS (Reflected Cross-Site Scripting)
    // ZAP sẽ báo: "Cross Site Scripting (Reflected)"
    const name = req.query.name || 'Admin';
    
    // 3. LỖI OPEN REDIRECT (Chuyển hướng không an toàn)
    // Thử truy cập: localhost/?url=http://google.com
    // ZAP sẽ báo: "External Redirect"
    const redirectUrl = req.query.url;
    if (redirectUrl) {
        return res.redirect(redirectUrl);
    }

    const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Vulnerable App</title>
        </head>
        <body>
            <h1>DEMO DEVSECOPS - FULL VULNERABILITIES</h1>
            <h3>Xin chao: ${name}</h3> 
            <p>Trang web nay chua Cookies hong, XSS va Open Redirect.</p>
            <br>
            <a href="/?url=https://www.google.com">Test Open Redirect (Di toi Google)</a>
        </body>
        </html>
    `;

    res.send(htmlContent);
});

// Chạy server
app.listen(80, () => {
    console.log('App running on port 80...');
});