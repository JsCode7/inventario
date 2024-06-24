import dbConnect from '../../../lib/mongoose';
import Log from '../../../models/Log.schema';
import { NextResponse } from 'next/server';

export async function GET(req) {
  await dbConnect();
  try {
    const logs = await Log.find({});
    return NextResponse.json({ success: true, data: logs });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 400 });
  }
}