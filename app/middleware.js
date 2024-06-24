import dbConnect from '../lib/mongoose';
import Log from '../models/Log.schema';

export default async function logger(req, info) {
  await dbConnect();
  const { method, url } = req;
  try {
    await Log.create({ action: url, method, info });
  } catch (error) {
    console.error('Error creating log: ', error )
  }

  return;
}
