# 🎬 MrZed0 VidKing Stremio Addon

A high-performance Stremio addon that allows users to stream movies and TV shows directly via **VidKing.net**. This project includes a built-in search engine, TMDb metadata catalogs, and a fancy landing page for easy user installation.

## 🌐 Live Demo
Check out the landing page and setup guide here:
* 🔗 [Online Version](https://mrzed0.com/stremio/)

---

## 🚀 Features
* **Full Search Support:** Find any movie or series directly within Stremio.
* **TMDb Integration:** Beautiful posters, backdrops, and descriptions.
* **Fancy Landing Page:** Professional `index.html` with a blurred backdrop and setup guide.
* **Auto-Healing:** Pre-configured for PM2 to restart automatically on server reboot.

---

## 🛠️ Server Prerequisites & Installation

Follow these steps to set up a fresh Ubuntu/Debian server for this addon.

---

### 1. Install Node.js & NPM
Run these commands to install the required environment:

sudo apt update
curl -fsSL [https://deb.nodesource.com/setup_20.x](https://deb.nodesource.com/setup_20.x) | sudo -E bash -
sudo apt install -y nodejs

2. Install PM2 (Process Manager)
PM2 ensures your addon stays online 24/7:
sudo npm install -g pm2

3. Clone & Setup the Project

git clone [https://github.com/YOUR_USERNAME/stremio-vidking.git](https://github.com/YOUR_USERNAME/stremio-vidking.git)
cd stremio-vidking
npm install

---

🔑 API Configuration (Required)
This addon requires a TMDb API Key to function. Without it, search and catalogs will not load.

1. Sign up for a free account at The Movie Database (TMDB).
2. Request an API Key (v3 auth) from your account settings.
3. Open addon.js and find this line:
const TMDB_API_KEY = "PASTE_YOUR_KEY_HERE";
Replace the placeholder with your actual key and save the file.

---

🏃 Running the Addon (PM2)
To keep the addon running 24/7 and ensure it starts after a server reboot:

Start the Process:

pm2 start server.js --name "stremio-addon"
Generate Startup Script:

pm2 startup
Copy and paste the sudo env PATH=... line that appears in your terminal and run it.

Save the State:
pm2 save

---

🌐 Web & Domain Setup
Landing Page: Ensure index.html and addon-background.jpg are in the same folder as your code.

Firewall: Ensure Port 7000 is open:

sudo ufw allow 7000/tcp
SSL (HTTPS): For the best experience on Stremio Web, it is highly recommended to use a Reverse Proxy (Nginx) to point your domain (e.g., stremio.yourdomain.com) to localhost:7000 with an SSL certificate.

---

⚠️ Troubleshooting: "Failed to Fetch"
If Stremio says "Failed to Fetch" but the URL works in your browser:

CORS: Ensure server.js includes the Access-Control-Allow-Origin headers.

HTTPS vs HTTP: Stremio Web (HTTPS) cannot talk to a local IP (HTTP) due to "Mixed Content" security. Use the Stremio Desktop App for local testing or set up a domain with HTTPS.

Adblockers: Ensure your browser isn't blocking the connection. Use uBlock Origin for the best experience.


⚖️ Disclaimer
This project does not host or store any video content. It is a metadata provider that links to third-party sources (VidKing.net). We do not control the media files or the advertisements served by the source. Use at your own risk.

© 2026 MrZed0.com
