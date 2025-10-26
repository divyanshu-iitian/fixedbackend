import os
import json
from pymongo import MongoClient
from pathlib import Path

# Load MongoDB URI from .env or fallback
MONGODB_URI = os.getenv('MONGODB_URI')
if not MONGODB_URI:
    # Try to read from .env file
    env_path = Path(__file__).parent / '.env'
    if env_path.exists():
        for line in env_path.read_text().splitlines():
            if line.startswith('MONGODB_URI='):
                MONGODB_URI = line.split('=', 1)[1].strip()
                break
if not MONGODB_URI:
    raise Exception('MongoDB URI not found in environment or .env file')

DB_NAME = 'gdgc-leaderboard'
COLLECTION_NAME = 'profiles'

# Load results from JSON file
RESULTS_PATH = Path('results_from_gform.json')
if not RESULTS_PATH.exists():
    raise Exception(f'{RESULTS_PATH} not found. Run batch_from_csv.py first.')

with RESULTS_PATH.open('r', encoding='utf-8') as f:
    profiles = json.load(f)

client = MongoClient(MONGODB_URI)
db = client[DB_NAME]
collection = db[COLLECTION_NAME]

# Upsert each profile
for profile in profiles:
    if 'url' not in profile:
        continue
    collection.update_one(
        {'url': profile['url']},
        {'$set': profile},
        upsert=True
    )

print(f"Saved {len(profiles)} profiles to MongoDB Atlas collection '{COLLECTION_NAME}'")
