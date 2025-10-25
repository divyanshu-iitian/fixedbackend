const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');

const URI = 'mongodb+srv://divyanshumishra0806_db_user:77K64gX5xX14nxmW@cluster0.xrv8slm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
const DB_NAME = 'gdgc-leaderboard';
const COLLECTION_NAME = 'profiles';
const JSON_PATH = path.join(__dirname, '..', 'merged_data.json'); // Changed to use merged_data.json

async function pushToMongo() {
    const client = new MongoClient(URI);
    try {
        console.log('Connecting to MongoDB...');
        await client.connect();
        console.log('Connected to MongoDB.');
        const db = client.db(DB_NAME);
        const collection = db.collection(COLLECTION_NAME);

        console.log('Reading scraped data from merged_data.json...');
        const jsonData = fs.readFileSync(JSON_PATH, 'utf-8');
        const profiles = JSON.parse(jsonData);
        console.log(`Read ${profiles.length} profiles from JSON file.`);

        if (profiles.length === 0) {
            console.log('No profiles to push. Exiting.');
            return;
        }

        console.log('Clearing existing profiles in MongoDB...');
        const deleteResult = await collection.deleteMany({});
        console.log(`Cleared ${deleteResult.deletedCount} profiles.`);

        console.log('Preparing data for bulk insert...');
        const operations = profiles.map(profile => ({
            updateOne: {
                filter: { url: profile.url },
                update: {
                    $set: {
                        name: profile.name,
                        url: profile.url,
                        badge_count: profile.badges.length,
                        badges: profile.badges,
                    }
                },
                upsert: true
            }
        }));

        console.log('Pushing new data to MongoDB...');
        const result = await collection.bulkWrite(operations);
        console.log('Data push complete.');
        console.log(`  - Matched: ${result.matchedCount}`);
        console.log(`  - Inserted: ${result.insertedCount}`);
        console.log(`  - Upserted: ${result.upsertedCount}`);
        console.log(`  - Modified: ${result.modifiedCount}`);

    } catch (error) {
        console.error('An unexpected error occurred:', error);
    } finally {
        await client.close();
        console.log('MongoDB connection closed.');
    }
}

pushToMongo();
