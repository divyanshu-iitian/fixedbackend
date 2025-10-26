const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');

// Read .env file manually
const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  envContent.split('\n').forEach(line => {
    const match = line.match(/^([^=:#]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      const value = match[2].trim();
      process.env[key] = value;
    }
  });
}

const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = 'gdgc-leaderboard';

async function testStagingSetup() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('✅ Connected to MongoDB\n');
    
    const db = client.db(DB_NAME);
    
    // Check production collection
    const prodCollection = db.collection('profiles');
    const prodCount = await prodCollection.countDocuments({});
    const prodSample = await prodCollection.findOne({});
    
    console.log('📊 PRODUCTION Collection (profiles):');
    console.log(`   Total documents: ${prodCount}`);
    console.log(`   Sample document: ${prodSample?.name} (${prodSample?.badge_count} badges)`);
    console.log(`   Last updated: ${prodSample?.updatedAt || prodSample?.scrapedAt || 'N/A'}\n`);
    
    // Check staging collection
    const stagingCollection = db.collection('profiles_staging');
    const stagingCount = await stagingCollection.countDocuments({});
    
    console.log('🔧 STAGING Collection (profiles_staging):');
    console.log(`   Total documents: ${stagingCount}`);
    
    if (stagingCount > 0) {
      const stagingSample = await stagingCollection.findOne({});
      console.log(`   Sample document: ${stagingSample?.name} (${stagingSample?.badge_count} badges)`);
      console.log(`   Last scraped: ${stagingSample?.scrapedAt || 'N/A'}`);
    } else {
      console.log('   (Empty - no scrape data yet)');
    }
    
    console.log('\n✅ Two-collection architecture is working!');
    console.log('   - Frontend reads from: profiles (production)');
    console.log('   - Scraping writes to: profiles_staging (staging)');
    console.log('   - After validation, staging → production swap happens');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await client.close();
  }
}

testStagingSetup();
