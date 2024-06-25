import dbConnect from '../../../lib/mongoose';
import Buy from '../../../models/Buy.schema';
import Product from '../../../models/Product.schema';
import { NextResponse } from 'next/server';
import logger from '../../middleware';

// GET method
export async function GET(req) {
  await dbConnect();
  try {
    const buys = await Buy.find({}).populate('product');
    return NextResponse.json({ success: true, data: buys });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 400 });
  }
}

// POST method
export async function POST(req) {
  await dbConnect();

  try {
    const body = await req.json();
    const buy = await Buy.create(body);

    // Update the product stock
    await Product.findByIdAndUpdate(buy.product, { $inc: { stock: buy.quantity } });

    await logger(req, body);
    return NextResponse.json({ success: true, data: buy }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 400 });
  }
}

// PUT method
export async function PUT(req) {
  await dbConnect();

  try {
    const body = await req.json();
    const { _id, quantity: newQuantity, product: newProduct } = body;
    const buy = await Buy.findById(_id);

    if (!buy) {
      return NextResponse.json({ success: false, message: 'Buy not found' }, { status: 404 });
    }

    // Revert the stock change of the original product
    await Product.findByIdAndUpdate(buy.product, { $inc: { stock: -buy.quantity } });

    // Update the buy record
    buy.product = newProduct;
    buy.quantity = newQuantity;
    buy.supplier = body.supplier;
    await buy.save();

    // Update the stock of the new product
    await Product.findByIdAndUpdate(newProduct, { $inc: { stock: newQuantity } });

    await logger(req, body);
    return NextResponse.json({ success: true, data: buy });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 400 });
  }
}

// DELETE method
export async function DELETE(req) {
  await dbConnect();

  try {
    const body = await req.json();
    const { id } = body;
    const buy = await Buy.findByIdAndDelete(id);

    if (!buy) {
      return NextResponse.json({ success: false, message: 'Buy not found' }, { status: 404 });
    }

    // Revert the stock change
    await Product.findByIdAndUpdate(buy.product, { $inc: { stock: -buy.quantity } });

    await logger(req, body);
    return NextResponse.json({ success: true, data: buy });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 400 });
  }
}
