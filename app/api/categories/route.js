// app/api/category/route.js
import dbConnect from '../../../lib/mongoose';
import Category from '../../../models/Category.schema';
import { NextResponse } from 'next/server';
import logger from '../../middleware';

// GET method
export async function GET(req) {
  await dbConnect();
  try {
    const categories = await Category.find({});
    return NextResponse.json({ success: true, data: categories });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 400 });
  }
}

// POST method
export async function POST(req) {
  await dbConnect();

  try {
    const body = await req.json();
    const category = await Category.create(body);
    await logger(req, body);
    return NextResponse.json({ success: true, data: category }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 400 });
  }
}

// PUT method
export async function PUT(req) {
  await dbConnect();
  const body = await req.json();
  const { _id, ...updateData } = body;

  try {
    const category = await Category.findByIdAndUpdate(_id, updateData, { new: true });
    if (!category) {
      return NextResponse.json({ success: false, message: 'Category not found' }, { status: 404 });
    }
    await logger(req, body);
    return NextResponse.json({ success: true, data: category });
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
    const category = await Category.findByIdAndDelete(id);
    if (!category) {
      return NextResponse.json({ success: false, message: 'Category not found' }, { status: 404 });
    }
    await logger(req, body);
    return NextResponse.json({ success: true, data: category });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 400 });
  }
}
