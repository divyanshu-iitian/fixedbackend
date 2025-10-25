const {MongoClient} = require('mongodb');

(async () => {
  const client = new MongoClient('mongodb+srv://divyanshumishra0806_db_user:77K64gX5xX14nxmW@cluster0.xrv8slm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');
  
  await client.connect();
  console.log('Connected to MongoDB');
  
  const db = client.db('gdgc-leaderboard');
  const col = db.collection('profiles');
  
  const all = await col.find({}).toArray();
  console.log(`Updating badge_count for ${all.length} profiles...`);
  
  for (const profile of all) {
    const count = (profile.badges || []).length;
    await col.updateOne(
      { _id: profile._id },
      { $set: { badge_count: count } }
    );
  }
  
  console.log('✅ Done! Checking results...\n');
  
  const top5 = await col.find({}).sort({ badge_count: -1 }).limit(5).toArray();
  console.log('Top 5:');
  top5.forEach((x, i) => console.log(`${i+1}. ${x.name} - ${x.badge_count} badges`));
  
  await client.close();
})();
