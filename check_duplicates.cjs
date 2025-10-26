const {MongoClient} = require('mongodb');

(async () => {
  const c = new MongoClient('mongodb+srv://divyanshumishra0806_db_user:77K64gX5xX14nxmW@cluster0.xrv8slm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');
  await c.connect();
  const db = c.db('gdgc-leaderboard');
  const col = db.collection('profiles');
  
  const count = await col.countDocuments();
  console.log('Total documents:', count);
  
  // Find duplicate names
  const duplicates = await col.aggregate([
    { $group: { _id: '$name', count: { $sum: 1 }, urls: { $push: '$url' } } },
    { $match: { count: { $gt: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 10 }
  ]).toArray();
  
  console.log('\nDuplicate names found:', duplicates.length);
  duplicates.forEach(d => {
    console.log(`${d._id}: ${d.count} times`);
    d.urls.forEach(u => console.log(`  - ${u}`));
  });
  
  await c.close();
})();
