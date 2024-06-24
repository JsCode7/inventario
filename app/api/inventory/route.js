// app/api/inventory/route.js
import dbConnect from '../../../lib/mongoose';
import Product from '../../../models/Product.schema';
import { NextResponse } from 'next/server';
import logger from '../../middleware';

// GET method
export async function GET(req) {
  await dbConnect();
  try {
    const products = await Product.find({});
    return NextResponse.json({ success: true, data: products });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 400 });
  }
}

// POST method
export async function POST(req) {
  await dbConnect();

  try {
    const body = await req.json();
    const product = await Product.create(body);
    await logger(req, body);
    return NextResponse.json({ success: true, data: product }, { status: 201 });
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
    const product = await Product.findByIdAndUpdate(_id, updateData, { new: true });
    if (!product) {
      return NextResponse.json({ success: false, message: 'Product not found' }, { status: 404 });
    }
    await logger(req, body);
    return NextResponse.json({ success: true, data: product });
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
    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      return NextResponse.json({ success: false, message: 'Product not found' }, { status: 404 });
    }
    await logger(req, body);
    return NextResponse.json({ success: true, data: product });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 400 });
  }
}
