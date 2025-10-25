const { MongoClient } = require('mongodb');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse/sync');

const URI = 'mongodb+srv://divyanshumishra0806_db_user:77K64gX5xX14nxmW@cluster0.xrv8slm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
const DB_NAME = 'gdgc-leaderboard';
const COLLECTION_NAME = 'profiles';
const CSV_PATH = path.join(__dirname, '..', 'gform.csv');
const SCRAPER_PATH = path.join(__dirname, '..', 'scraper.py');

async function main() {
    const client = new MongoClient(URI);
    try {
        console.log('Connecting to MongoDB...');
        await client.connect();
        console.log('Connected to MongoDB.');
        const db = client.db(DB_NAME);
        const collection = db.collection(COLLECTION_NAME);

        console.log('Clearing existing profiles...');
        const deleteResult = await collection.deleteMany({});
        console.log(`Cleared ${deleteResult.deletedCount} profiles.`);

        const csvData = fs.readFileSync(CSV_PATH, 'utf-8');
        const records = parse(csvData, {
            columns: true,
            skip_empty_lines: true
        });


        console.log(`Found ${records.length} profiles to scrape.`);

        for (let i = 0; i < records.length; i++) {
            const record = records[i];
            const name = record['Your Full Name'];
            const url = record['[VERY IMPORTANT] Please share your Google Cloud Skills Boost Public Profile URL                       (See how to get your profile URL- https://bit.ly/ql-public)*\nHere\'s what it should look like -  https://www.cloudskillsboost.google/public_profiles/PROFILE_ID'];

            if (!url || !url.startsWith('http')) {
                console.warn(`Skipping row ${i + 1} due to invalid or missing URL: ${url}`);
                continue;
            }

            console.log(`[${i + 1}/${records.length}] Scraping ${name.trim()}...`);

            try {
                const profileData = await scrapeProfile(url.trim());
                if (profileData) {
                    const filter = { url: profileData.url };
                    const update = {
                        $set: {
                            name: profileData.name,
                            badge_count: profileData.badges.length,
                            badges: profileData.badges,
                        }
                    };
                    const options = { upsert: true };
                    await collection.updateOne(filter, update, options);
                    console.log(`  -> Saved ${profileData.name} with ${profileData.badges.length} badges.`);
                }
            } catch (error) {
                console.error(`  -> Failed to scrape or save ${name.trim()}:`, error);
            }
        }

        console.log('All profiles have been processed.');

    } catch (error) {
        console.error('An unexpected error occurred:', error);
    } finally {
        await client.close();
        console.log('MongoDB connection closed.');
    }
}

function scrapeProfile(url) {
    return new Promise((resolve, reject) => {
        const pythonProcess = spawn('py', ['-3', SCRAPER_PATH, url]);

        let data = '';
        pythonProcess.stdout.on('data', (chunk) => {
            data += chunk.toString();
        });

        let error = '';
        pythonProcess.stderr.on('data', (chunk) => {
            error += chunk.toString();
        });

        pythonProcess.on('close', (code) => {
            if (code !== 0) {
                return reject(new Error(`Scraper exited with code ${code}: ${error}`));
            }
            try {
                const profile = JSON.parse(data);
                resolve(profile);
            } catch (e) {
                reject(new Error(`Failed to parse JSON from scraper: ${e.message}`));
            }
        });
    });
}

main();
