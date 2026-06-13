import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Category from '@/models/Category';
import { protect, admin } from '@/lib/auth';

export async function GET() {
  await connectDB();
  try {
    const categories = await Category.find({}).sort({ name: 1 });
    return NextResponse.json({ success: true, count: categories.length, data: categories }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  await connectDB();
  const userReq = await protect(req);
  if (!userReq || !(await admin(userReq))) return NextResponse.json({ success: false, message: 'Not authorized as admin' }, { status: 403 });

  try {
    const { name, description, icon } = await req.json();
    const categoryExists = await Category.findOne({ name });
    if (categoryExists) return NextResponse.json({ success: false, message: 'Category already exists' }, { status: 400 });

    const category = await Category.create({ name, description, icon, createdBy: userReq._id });
    return NextResponse.json({ success: true, data: category }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
