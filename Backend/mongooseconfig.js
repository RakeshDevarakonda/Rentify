import mongoose from 'mongoose';

export const mongoosedatabse = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    console.log("Database Connected");
  } catch (error) {
    console.error(error);
  }
};
