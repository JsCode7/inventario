import dbConnect from '../../../lib/mongoose';
import Sale from '../../../models/Sale.schema';
import Product from '../../../models/Product.schema';
import User from '../../../models/User.schema';
import { NextResponse } from 'next/server';
import logger from '../../middleware';

export async function GET(req) {
  await dbConnect();
  try {
    const sales = await Sale.find({}).populate('product').populate('user');
    return NextResponse.json({ success: true, data: sales });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 400 });
  }
}

export async function POST(req) {
  await dbConnect();
  const body = await req.json();

  try {
    const lastSale = await Sale.findOne().sort({ saleCode: -1 });
    const saleCode = lastSale ? lastSale.saleCode + 1 : 1;

    const sale = await Sale.create({ ...body, saleCode });

    // Update product stock
    const product = await Product.findById(body.product);
    product.stock -= body.quantity;
    await product.save();

    await logger(req, body);
    return NextResponse.json({ success: true, data: sale }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 400 });
  }
}

export async function PUT(req) {
  await dbConnect();
  const body = await req.json();
  const { _id, ...updateData } = body;

  try {
    const sale = await Sale.findById(_id);
    if (!sale) {
      return NextResponse.json({ success: false, message: 'Sale not found' }, { status: 404 });
    }

    // Update product stock
    const product = await Product.findById(sale.product);
    product.stock += sale.quantity;  // Restore previous stock
    product.stock -= updateData.quantity;  // Apply new quantity
    await product.save();

    const updatedSale = await Sale.findByIdAndUpdate(_id, updateData, { new: true });
    await logger(req, body);
    return NextResponse.json({ success: true, data: updatedSale });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 400 });
  }
}

export async function DELETE(req) {
  await dbConnect();
  const body = await req.json();
  const { id } = body;

  try {
    const sale = await Sale.findById(id);
    if (!sale) {
      return NextResponse.json({ success: false, message: 'Sale not found' }, { status: 404 });
    }

    // Restore product stock
    const product = await Product.findById(sale.product);
    product.stock += sale.quantity;
    await product.save();

    await sale.remove();
    await logger(req, body);
    return NextResponse.json({ success: true, data: sale });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 400 });
  }
}
