import mongoose from 'mongoose';

export const mongoosedatabse = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    console.log("process.env.MONGODB_URI",process.env.MONGODB_URI);
  } catch (error) {
    console.error(error);
  }
};
