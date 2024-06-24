// app/api/users/route.js
import dbConnect from '../../../lib/mongoose';
import User from '../../../models/User.schema';
import { NextResponse } from 'next/server';
import logger from '../../middleware';

// GET method
export async function GET(req) {
  await dbConnect();
  try {
    const users = await User.find({});
    return NextResponse.json({ success: true, data: users });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 400 });
  }
}

// POST method
export async function POST(req) {
  await dbConnect();

  try {
    const body = await req.json();
    const user = await User.create(body);
    await logger(req, body);
    return NextResponse.json({ success: true, data: user }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 400 });
  }
}

export async function PUT(req) {
  await dbConnect();
  const body = await req.json();
  const { _id, ...updateData } = body;

  try {
    const user = await User.findByIdAndUpdate(_id, updateData, { new: true });
    if (!user) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }
    await logger(req, body);
    return NextResponse.json({ success: true, data: user });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 400 });
  }
}

// DELETE method
export async function DELETE(req) {
  await dbConnect();
  const body = await req.json();
  const { id } = body;
  
  try {
    const user = await User.findByIdAndDelete(id);
    console.log(user)
    if (!user) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }
    await logger(req, body);
    return NextResponse.json({ success: true, data: user });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 400 });
  }
}