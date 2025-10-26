# Post-Deployment Monitoring Checklist

## Immediate (After Deploy - 5-10 minutes)

### ✅ Step 1: Check Render Deployment
1. Go to: https://dashboard.render.com
2. Find service: `fixedbackend`
3. Check "Events" tab
4. Look for: **"Deploy succeeded"** message

### ✅ Step 2: Check Server Logs
Look for these specific messages in Render logs:

```
[MongoDB] Connecting...
[MongoDB] ✅ Connected successfully (Production + Staging)  ← MUST SEE THIS!
[Cache] ✅ Loaded 187 profiles from production MongoDB
Server listening on http://localhost:4000
```

**If you see these → Deployment successful!** ✅

### ✅ Step 3: Test API
Open in browser:
```
https://fixedbackend-6w41.onrender.com/api/leaderboard
```

Check:
- [ ] Returns JSON array
- [ ] Has ~185-187 profiles
- [ ] All names are proper (NO "Unknown")
- [ ] All have `badge_count` field
- [ ] All have `required_labs_completed` field (0-20)

---

## During Next Scrape (Wait ~20 minutes)

### ✅ Step 4: Watch Scraping Logs
After cron triggers (every 20 minutes), look for:

```
[scrape] Starting scrape at 2025-01-28T...
[scrape] Batch mode: ALL profiles
[scrape] ✅ Scraping completed successfully
[scrape] 📄 Read 186 profiles from output file

[Staging] 💾 Saved 186 profiles to staging  ← NEW LOG!

[Promote] Staging has 186 profiles, 185 with valid names  ← NEW LOG!
[Promote] ✅ Promoted 185 profiles to production  ← NEW LOG!

[scrape] 🎉 Cache updated from production: 185 profiles  ← NEW LOG!
[scrape] 💾 Backup saved to fallback file
```

**These are the key NEW logs from two-collection architecture!**

### ✅ Step 5: Verify Frontend Still Works
Open frontend:
```
https://divyanshu-iitian.github.io/gdgc-frontend/
```

Check:
- [ ] Leaderboard loads properly
- [ ] All names visible (NO "Unknown")
- [ ] Completed (20/20) stat is correct
- [ ] Top 10 chart shows all 10 names
- [ ] Mobile responsive works

---

## If Something Goes Wrong

### ❌ Scenario: "Unknown" Names Appear

**Check logs for:**
```
[Promote] ⚠️ Not enough valid profiles (100/150 minimum). Keeping old data.
```

This means:
- Scraping produced too many "Unknown" names
- Validation FAILED (this is GOOD!)
- Production was NOT updated (frontend safe!)
- Old stable data still being served

**Action**: Check CSV file has all names in column 4

### ❌ Scenario: Scraping Fails

**Check logs for:**
```
[scrape] ❌ Failed with code 1
Playwright timeout: Could not connect
```

This means:
- Python scraper crashed
- Staging NOT updated
- Production UNTOUCHED (frontend safe!)

**Action**: Check Render free tier limits (might be sleeping)

### ❌ Scenario: No "Production + Staging" Log

**This is CRITICAL!** It means:
- Two collections not initialized
- Deployment might have failed
- Check for MongoDB connection errors

**Action**: 
1. Check MongoDB Atlas is accessible
2. Check `MONGODB_URI` environment variable in Render
3. Redeploy if needed

---

## Success Indicators

✅ **Everything Working If:**
1. Logs show "Production + Staging" on startup
2. API returns ~185-187 profiles with proper names
3. Every 20 minutes, see "Staging → Promote → Cache" flow
4. Frontend never shows "Unknown" names
5. Leaderboard updates every ~20 minutes

✅ **Protection Working If:**
- When scraping fails → Old data still on frontend (safe!)
- When validation fails → Promotion skipped (production unchanged)
- CSV fallback ensures names in staging (double safety)

---

## Quick Debug Commands

### Check Production Collection (MongoDB Atlas)
```javascript
// In MongoDB Atlas UI, run this query:
db.profiles.countDocuments({})
// Should show: ~185-187

db.profiles.countDocuments({ name: "Unknown" })
// Should show: 0 (NO "Unknown" names!)
```

### Check Staging Collection
```javascript
db.profiles_staging.countDocuments({})
// After scrape: 186
// Between scrapes: Can be 0 or old data (doesn't matter)
```

### Check API Health
```bash
curl https://fixedbackend-6w41.onrender.com/api/health
# Should return: { "status": "ok" }
```

### Check API Status
```bash
curl https://fixedbackend-6w41.onrender.com/api/status
# Should return cache info with updatedAt timestamp
```

---

## Timeline

### T + 0 min (Now)
- ✅ Code pushed to GitHub
- Render deployment started

### T + 5 min
- ✅ Render build complete
- ✅ Server restarted
- **CHECK**: "Production + Staging" log

### T + 10 min
- ✅ Server fully running
- ✅ Cache loaded from production
- **TEST**: API endpoint works

### T + 20 min (First Cron)
- ✅ Scraper runs automatically
- ✅ Staging updated
- ✅ Validation passes
- ✅ Production promoted
- **VERIFY**: New data on frontend

### T + 40 min (Second Cron)
- ✅ Another scrape cycle
- **CONFIRM**: Two-collection workflow stable

---

## Expected Behavior

### Normal Operation (Every 20 minutes):
```
1. Cron triggers
2. Python scraper runs (3 workers, ~5 minutes)
3. Data saved to staging collection
4. Validation checks (min 150 valid profiles)
5. If valid: Atomic swap (staging → production)
6. Cache refreshed from production
7. API serves new data to frontend
```

### Failure Handling:
```
1. Cron triggers
2. Scraper fails OR produces bad data
3. Validation fails (not enough valid profiles)
4. Production UNCHANGED (old data safe!)
5. Frontend continues showing stable data
6. Next cron will retry in 20 minutes
```

---

## Contact

Agar kuch bhi issue aaye, immediately check karo:
1. Render logs (most important!)
2. MongoDB Atlas dashboard (collection counts)
3. Frontend behavior (user-facing impact)

**Most Important**: Look for "Production + Staging" log on server startup. Agar yeh dikha, toh architecture working hai! ✅

---

**Deployment Time**: ~5-10 minutes
**First Scrape**: Next 20-minute cron cycle
**Full Verification**: Within 30-40 minutes

Happy monitoring! 🚀
