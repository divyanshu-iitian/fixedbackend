# 🚀 Deploy GDGC GGV Backend to Render

## 📋 Prerequisites

1. ✅ GitHub account
2. ✅ Render account (https://render.com - Free tier available)
3. ✅ MongoDB Atlas connection string
4. ✅ CSV file with participant data (`gform.csv`)

---

## 📁 Files to Include in GitHub Repo

### ✅ Essential Backend Files:
```
fixedbackend/
├── index.js              # Main Express server
├── scraper.py           # Python scraper script
├── batch_from_csv.py    # Batch scraping script
├── gform.csv            # Participant data (205 rows)
├── package.json         # Node.js dependencies
├── requirements.txt     # Python dependencies
├── .gitignore          # Git ignore rules
└── README.md           # Documentation
```

### ❌ Files to EXCLUDE (already in .gitignore):
- `node_modules/`
- `.env`
- `data/`
- `*.json` (temporary data files)
- `__pycache__/`

---

## 🔧 Step 1: Prepare Backend for Deployment

### 1.1 Update `.gitignore`
Ensure these are in `.gitignore`:
```
node_modules/
.env
data/
*.json
!package.json
__pycache__/
*.pyc
```

### 1.2 Add Environment Variable Support
Your `index.js` already uses:
```javascript
const MONGODB_URI = process.env.MONGODB_URI || 'your-connection-string';
const PORT = process.env.PORT || 4000;
```
✅ This is perfect for Render!

---

## 🌐 Step 2: Push to GitHub

### 2.1 Initialize Git (if not already done)
```bash
cd C:\Users\hp\OneDrive\Desktop\scraper\GDGc-Backend

# Remove old git if exists
rm -rf .git

# Initialize new repo
git init
git add .
git commit -m "Initial commit - GDGC GGV Backend"
```

### 2.2 Add Remote and Push
```bash
# Add your new GitHub repo
git remote add origin https://github.com/divyanshu-iitian/fixedbackend.git

# Push to GitHub
git branch -M main
git push -u origin main
```

---

## 🚀 Step 3: Deploy on Render

### 3.1 Create New Web Service

1. Go to https://render.com/dashboard
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub account
4. Select repository: `divyanshu-iitian/fixedbackend`
5. Click **"Connect"**

### 3.2 Configure Build Settings

**Basic Settings:**
- **Name**: `gdgc-ggv-backend` (or any name you want)
- **Region**: Choose closest to you (e.g., Oregon USA)
- **Branch**: `main`
- **Root Directory**: Leave blank (or `.` if needed)

**Build & Deploy:**
- **Runtime**: `Node`
- **Build Command**: 
  ```bash
  npm install && pip3 install -r requirements.txt && playwright install chromium
  ```
- **Start Command**:
  ```bash
  node index.js
  ```

**Instance Type:**
- Select **Free** (512 MB RAM, auto-sleep after 15 min inactivity)
  - ⚠️ Note: Free tier sleeps after inactivity, causing 50-second cold starts
  - Upgrade to **Starter ($7/month)** for always-on service

### 3.3 Environment Variables

Click **"Advanced"** → **"Add Environment Variable"**

Add these variables:

| Key | Value | Notes |
|-----|-------|-------|
| `MONGODB_URI` | `mongodb+srv://divyanshumishra0806_db_user:77K64gX5xX14nxmW@cluster0.xrv8slm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0` | Your MongoDB connection string |
| `PORT` | `4000` | Port number (Render auto-assigns, but good to set) |
| `PYTHON` | `python3` | Python command for Linux |
| `NODE_ENV` | `production` | Environment mode |

### 3.4 Deploy!

1. Click **"Create Web Service"**
2. Wait 5-10 minutes for:
   - ✅ Node.js installation
   - ✅ Python dependencies
   - ✅ Playwright Chromium browser
   - ✅ First deployment
3. Watch the logs for success message:
   ```
   Server listening on http://localhost:4000
   [MongoDB] ✅ Connected successfully
   ```

---

## 🔍 Step 4: Test Your Deployed Backend

### 4.1 Get Your Render URL
After deployment, you'll get a URL like:
```
https://gdgc-ggv-backend.onrender.com
```

### 4.2 Test Endpoints

**Health Check:**
```bash
curl https://gdgc-ggv-backend.onrender.com/api/health
```
Expected: `{"ok":true,"time":"2025-10-25T..."}`

**Leaderboard Data:**
```bash
curl https://gdgc-ggv-backend.onrender.com/api/leaderboard
```
Expected: JSON array with 185+ profiles

**Trigger Manual Scrape:**
```bash
curl -X POST https://gdgc-ggv-backend.onrender.com/api/scrape
```

---

## ⚙️ Step 5: Configure Auto-Scraping

Your backend already has **automatic scraping every 20 minutes**:

```javascript
// In index.js
cron.schedule('*/20 * * * *', async () => {
  console.log('[cron] Starting scheduled full scrape...');
  const result = await runScrape(null);
  // ... automatically updates MongoDB
});
```

✅ This runs automatically on Render!

### How it works:
1. Every 20 minutes, scrapes all 187 profiles
2. Updates MongoDB with latest badge counts
3. Frontend automatically fetches updated data

---

## 🎨 Step 6: Update Frontend to Use Render URL

Update your frontend (`leaderboard-website/src/pages/Home.jsx` and `Leaderboard.jsx`):

```javascript
// Change this:
const API_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:4000' 
  : 'https://gdgc-backend-1.onrender.com'

// To this:
const API_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:4000' 
  : 'https://gdgc-ggv-backend.onrender.com'  // ← Your new Render URL
```

---

## 🐛 Troubleshooting

### Issue 1: "Build failed - playwright not found"
**Solution:** Add to Build Command:
```bash
npm install && pip3 install -r requirements.txt && playwright install chromium
```

### Issue 2: "Python not found"
**Solution:** Render supports Python out of the box. Ensure:
- `requirements.txt` exists in root
- Build command includes: `pip3 install -r requirements.txt`

### Issue 3: "MongoDB connection timeout"
**Solution:** 
1. Check MongoDB Atlas → Network Access → Add Render IP
2. Or use **"Allow access from anywhere"** (0.0.0.0/0)

### Issue 4: "Scraping not working"
**Solution:**
- Check logs: Dashboard → Your Service → Logs
- Verify `gform.csv` is in repo
- Verify `scraper.py` is in repo

### Issue 5: "Service keeps sleeping (Free tier)"
**Solution:**
- Upgrade to Starter plan ($7/month) for always-on
- Or use external ping service (e.g., UptimeRobot) to keep it awake

---

## 📊 Monitoring & Logs

### View Live Logs:
1. Go to Render Dashboard
2. Click your service
3. Go to **"Logs"** tab
4. Watch real-time output:
   ```
   [Cache] Initializing...
   [MongoDB] Connecting...
   Server listening on http://localhost:4000
   [cron] Starting scheduled full scrape...
   [scrape] Completed successfully
   [MongoDB] 💾 Saved 187 profiles
   ```

### Check Service Status:
```bash
curl https://gdgc-ggv-backend.onrender.com/api/status
```
Returns:
```json
{
  "updatedAt": "2025-10-25T10:30:00.000Z",
  "count": 187
}
```

---

## 🔄 Step 7: Enable CORS for Frontend

Your backend already has CORS enabled:
```javascript
app.use(cors({ origin: '*' }));
```
✅ This allows your frontend (deployed on Vercel/Netlify) to access the API!

---

## 📝 Summary Checklist

- [ ] Push code to GitHub: `https://github.com/divyanshu-iitian/fixedbackend.git`
- [ ] Create Render Web Service
- [ ] Configure build: `npm install && pip3 install -r requirements.txt && playwright install chromium`
- [ ] Set environment variables (MONGODB_URI, PORT, PYTHON)
- [ ] Deploy and wait ~10 minutes
- [ ] Test endpoints: `/api/health`, `/api/leaderboard`
- [ ] Update frontend with new Render URL
- [ ] Verify auto-scraping works (check logs after 20 min)
- [ ] Monitor MongoDB for updated data

---

## 🎉 Success!

Your backend is now:
✅ Deployed on Render
✅ Auto-scraping every 20 minutes
✅ Saving to MongoDB
✅ Serving API at `/api/leaderboard`
✅ CORS-enabled for frontend

**Your API URL:**
```
https://gdgc-ggv-backend.onrender.com/api/leaderboard
```

Use this in your frontend! 🚀

---

## 💡 Next Steps

1. **Deploy Frontend** on Vercel/Netlify
2. **Set Custom Domain** (optional)
3. **Monitor Performance** via Render dashboard
4. **Upgrade to Starter** for better performance ($7/month)

---

Need help? Check Render docs: https://render.com/docs
