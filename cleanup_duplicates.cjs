const { MongoClient, ObjectId } = require('mongodb');

(async () => {
  const uri = 'mongodb+srv://divyanshumishra0806_db_user:77K64gX5xX14nxmW@cluster0.xrv8slm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
  const client = new MongoClient(uri);
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    const db = client.db('gdgc-leaderboard');
    const col = db.collection('profiles');

    // Find duplicate URLs
    const dupCursor = col.aggregate([
      { $group: { _id: '$url', count: { $sum: 1 }, ids: { $push: '$_id' } } },
      { $match: { count: { $gt: 1 } } }
    ]);

    const duplicates = await dupCursor.toArray();
    console.log('Found', duplicates.length, 'duplicate url groups');

    let totalRemoved = 0;
    for (const grp of duplicates) {
      const ids = grp.ids;
      // keep the first id, remove the rest
      const keepId = ids[0];
      const removeIds = ids.slice(1);
      if (removeIds.length > 0) {
        const r = await col.deleteMany({ _id: { $in: removeIds } });
        totalRemoved += r.deletedCount || 0;
        console.log(`Removed ${r.deletedCount || 0} duplicates for url=${grp._id}`);
      }
    }

    console.log('Total documents removed:', totalRemoved);

    // Recreate unique index on url
    try {
      console.log('Creating unique index on url (if not exists)...');
      await col.createIndex({ url: 1 }, { unique: true });
      console.log('Unique index on url created successfully');
    } catch (ixErr) {
      console.error('Index creation failed:', ixErr.message);
    }

    // Show top 5 by badge_count
    const top = await col.find({}).sort({ badge_count: -1 }).limit(5).toArray();
    console.log('Top 5 after cleanup:');
    top.forEach((p, i) => console.log(`${i+1}. ${p.name} - ${p.badge_count} badges (url: ${p.url})`));

  } catch (err) {
    console.error('Error during cleanup:', err);
  } finally {
    await client.close();
    console.log('Disconnected from MongoDB');
  }
})();
