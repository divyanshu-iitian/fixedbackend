# ⚡ Quick Reference - Render Deployment

## 🚀 One-Line Commands

### Push to GitHub (PowerShell - Windows)
```powershell
cd C:\Users\hp\OneDrive\Desktop\scraper\GDGc-Backend
.\deploy-to-github.ps1
```

### Or Manual Push
```powershell
cd C:\Users\hp\OneDrive\Desktop\scraper\GDGc-Backend
git init
git add .
git commit -m "Deploy GDGC GGV Backend"
git remote add origin https://github.com/divyanshu-iitian/fixedbackend.git
git push -u origin main --force
```

---

## 🌐 Render Configuration (Copy-Paste)

### Build Command
```bash
npm install && pip3 install -r requirements.txt && playwright install chromium
```

### Start Command
```bash
node index.js
```

### Environment Variables
```
MONGODB_URI = mongodb+srv://divyanshumishra0806_db_user:77K64gX5xX14nxmW@cluster0.xrv8slm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0

PORT = 4000

PYTHON = python3

NODE_ENV = production
```

---

## 🔗 API Endpoints (After Deploy)

**Replace `YOUR_APP_NAME` with your actual Render app name**

### Health Check
```
https://YOUR_APP_NAME.onrender.com/api/health
```

### Leaderboard Data
```
https://YOUR_APP_NAME.onrender.com/api/leaderboard
```

### Manual Scrape Trigger
```
https://YOUR_APP_NAME.onrender.com/api/scrape
```

### Status Check
```
https://YOUR_APP_NAME.onrender.com/api/status
```

---

## 🎯 After Deployment - Update Frontend

In your frontend code (`Home.jsx`, `Leaderboard.jsx`), update:

```javascript
const API_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:4000' 
  : 'https://YOUR_APP_NAME.onrender.com'  // ← Replace with your Render URL
```

---

## 📊 Expected Deployment Timeline

- ⏱️ **0-2 min**: Installing Node.js dependencies
- ⏱️ **2-5 min**: Installing Python dependencies
- ⏱️ **5-8 min**: Installing Playwright Chromium browser
- ⏱️ **8-10 min**: Starting server & connecting MongoDB
- ✅ **10 min**: Deployment complete!

---

## ✅ Success Checklist

- [ ] Code pushed to GitHub
- [ ] Render Web Service created
- [ ] Build command configured
- [ ] Environment variables set
- [ ] Deployment successful (check logs)
- [ ] `/api/health` returns `{"ok":true}`
- [ ] `/api/leaderboard` returns data
- [ ] Frontend updated with Render URL
- [ ] Auto-scraping works (check after 20 min)

---

## 🐛 Quick Troubleshooting

**Build fails at Playwright:**
```bash
# Add to Build Command:
npm install && pip3 install -r requirements.txt && playwright install --with-deps chromium
```

**MongoDB connection timeout:**
- Go to MongoDB Atlas → Network Access
- Add `0.0.0.0/0` to whitelist

**Service sleeps (Free tier):**
- Upgrade to Starter ($7/month)
- Or ping every 14 minutes with UptimeRobot

---

## 📞 Support

- GitHub Issues: https://github.com/divyanshu-iitian/fixedbackend/issues
- Render Docs: https://render.com/docs
- Full Guide: `RENDER_DEPLOY_GUIDE.md`

---

**🎉 Happy Deploying!**
