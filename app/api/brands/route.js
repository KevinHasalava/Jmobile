import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Brand from '@/models/Brand';
import { protect, admin } from '@/lib/auth';

export async function GET() {
  await connectDB();
  try {
    const brands = await Brand.find({}).sort({ name: 1 });
    return NextResponse.json({ success: true, count: brands.length, data: brands }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  await connectDB();
  const userReq = await protect(req);
  if (!userReq || !(await admin(userReq))) return NextResponse.json({ success: false, message: 'Not authorized as admin' }, { status: 403 });

  try {
    const { name, description, image } = await req.json();
    const brandExists = await Brand.findOne({ name });
    if (brandExists) return NextResponse.json({ success: false, message: 'Brand already exists' }, { status: 400 });

    const brand = await Brand.create({ name, description, image, createdBy: userReq._id });
    return NextResponse.json({ success: true, data: brand }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
