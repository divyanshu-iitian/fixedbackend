# 🎯 GDGC GGV Backend - Leaderboard API

**Auto-scraping backend for Google Cloud Study Jams 2025 Leaderboard**

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com)

---

## 🚀 Features

- ✅ **Auto-scraping**: Scrapes 187 profiles every 20 minutes
- ✅ **MongoDB Integration**: Stores and updates badge data
- ✅ **RESTful API**: Serves leaderboard data via `/api/leaderboard`
- ✅ **CORS Enabled**: Works with any frontend
- ✅ **Python + Node.js**: Uses Playwright for scraping
- ✅ **Production Ready**: Designed for Render deployment

---

## 📦 Tech Stack

**Backend:**
- Node.js + Express
- MongoDB (MongoDB Atlas)
- node-cron (auto-scheduling)

**Scraping:**
- Python 3
- Playwright (headless browser)
- BeautifulSoup4
- Requests

---

## 🔧 Local Development

### Prerequisites
- Node.js 18+
- Python 3.8+
- MongoDB Atlas account

### Setup

1. **Clone repo:**
   ```bash
   git clone https://github.com/divyanshu-iitian/fixedbackend.git
   cd fixedbackend
   ```

2. **Install Node dependencies:**
   ```bash
   npm install
   ```

3. **Install Python dependencies:**
   ```bash
   pip install -r requirements.txt
   playwright install chromium
   ```

4. **Set environment variables:**
   Create `.env` file:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   PORT=4000
   PYTHON=python3
   ```

5. **Run server:**
   ```bash
   npm start
   ```

Server runs on `http://localhost:4000`

---

## 🌐 API Endpoints

### `GET /api/leaderboard`
Returns all participants with badge data.

**Response:**
```json
[
  {
    "name": "Abhishek Ranjan",
    "url": "https://www.cloudskillsboost.google/...",
    "badge_count": 65,
    "badges": ["Badge 1", "Badge 2", ...],
    "titles": ["Badge 1", "Badge 2", ...],
    "updatedAt": "2025-10-25T10:30:00.000Z"
  },
  ...
]
```

### `GET /api/health`
Health check endpoint.

**Response:**
```json
{
  "ok": true,
  "time": "2025-10-25T10:30:00.000Z"
}
```

### `GET /api/status`
Returns cache status.

**Response:**
```json
{
  "updatedAt": "2025-10-25T10:30:00.000Z",
  "count": 187
}
```

### `POST /api/scrape`
Manually trigger scraping (takes 10-15 minutes).

**Response:**
```json
{
  "ok": true,
  "stdout": "..."
}
```

---

## 📊 Data Flow

```
gform.csv (205 participants)
    ↓
batch_from_csv.py (Node orchestrator)
    ↓
scraper.py (Python Playwright scraper)
    ↓
MongoDB Atlas (profiles collection)
    ↓
Express API (/api/leaderboard)
    ↓
Frontend (React app)
```

---

## ⏰ Auto-Scraping Schedule

The backend automatically scrapes **every 20 minutes**:

```javascript
cron.schedule('*/20 * * * *', async () => {
  // Scrape all 187 profiles
  // Update MongoDB
  // Cache updated data
});
```

---

## 🚀 Deploy to Render

**One-click deploy**: See [`RENDER_DEPLOY_GUIDE.md`](RENDER_DEPLOY_GUIDE.md)

**Quick steps:**
1. Push to GitHub
2. Create Render Web Service
3. Set environment variables
4. Deploy!

---

## 📁 Project Structure

```
fixedbackend/
├── index.js                  # Express server + cron jobs
├── scraper.py               # Python scraper (Playwright)
├── batch_from_csv.py        # Batch scraping orchestrator
├── gform.csv                # Participant data (205 rows)
├── package.json             # Node dependencies
├── requirements.txt         # Python dependencies
├── .gitignore              # Git ignore rules
├── README.md               # This file
└── RENDER_DEPLOY_GUIDE.md  # Deployment guide
```

---

## 🔑 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `MONGODB_URI` | MongoDB Atlas connection string | ✅ Yes |
| `PORT` | Server port (default: 4000) | ❌ No |
| `PYTHON` | Python command (default: `py -3` on Windows, `python3` on Linux) | ❌ No |

---

## 🐛 Troubleshooting

**Issue: MongoDB connection fails**
- Check MongoDB Atlas → Network Access
- Add `0.0.0.0/0` to IP whitelist

**Issue: Playwright not working**
- Run: `playwright install chromium`
- On Render: Add to build command

**Issue: Scraping takes too long**
- Normal: 10-15 minutes for 187 profiles
- Uses 3 concurrent workers

---

## 📝 License

MIT License - feel free to use for your GDGC events!

---

## 🤝 Contributing

1. Fork the repo
2. Create feature branch: `git checkout -b feature/amazing`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push: `git push origin feature/amazing`
5. Open Pull Request

---

## 👨‍💻 Author

**Divyanshu Mishra**
- GitHub: [@divyanshu-iitian](https://github.com/divyanshu-iitian)
- Organization: GDGC GGV (Guru Ghasidas Vishwavidyalaya)

---

## 🎉 Acknowledgments

- Google Cloud Skills Boost
- MongoDB Atlas
- Render.com
- GDG Community

---

**Need help?** Open an issue on GitHub!

