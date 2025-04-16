import mongoose from 'mongoose';

async function testConnection() {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);
    console.log('MongoDB connected successfully');
    

    const db = mongoose.connection;
    await db.createCollection('test');
    console.log('Test collection created');
    
    await db.dropCollection('test');
    console.log('Test collection dropped');
    
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
  }
}

testConnection(); 