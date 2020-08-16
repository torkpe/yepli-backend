import mongoose from 'mongoose';

export async function connect() {
  try {
    const connection = await mongoose.connect(process.env.DATABASE_URL, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
    });
    console.log('connected to the db');
    return connection.connection.db;
  } catch (err) {
    console.log(err);
  }
}
