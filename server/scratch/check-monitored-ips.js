import mongoose from "mongoose";

async function check() {
  try {
    await mongoose.connect('mongodb+srv://Soumi:aagbankoGJykziFB@cluster0.reuzsje.mongodb.net/securenet');
    
    // Querying the collection directly
    const collection = mongoose.connection.db.collection('monitoredips');
    const ips = await collection.find({}).toArray();
    
    console.log(`\n=============================================================`);
    console.log(`Found ${ips.length} Monitored IPs in the database`);
    console.log(`=============================================================`);
    
    if (ips.length === 0) {
      console.log("No IPs logged yet! Make sure you visited the frontend or sent a request to the backend.");
    } else {
      ips.forEach(ip => {
        console.log(`📡 IP Address: ${ip.ip}`);
        console.log(`   🕒 Last Seen: ${new Date(ip.lastSeen).toLocaleString()}`);
        console.log(`   🔢 Total Requests Made: ${ip.requestCount}`);
        console.log(`-------------------------------------------------------------`);
      });
    }
    
  } catch (err) {
    console.error("Error connecting to DB:", err);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

check();
