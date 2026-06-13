import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import ContactInquiry from '@/models/ContactInquiry';
import { protect, admin } from '@/lib/auth';

export async function POST(req, { params }) {
  await connectDB();
  try {
    const { name, email, subject, message } = await req.json();
    if (!name || !email || !subject || !message) {
      return NextResponse.json({ success: false, message: 'Please provide all required fields' }, { status: 400 });
    }
    const inquiry = await ContactInquiry.create({ name, email, subject, message });
    return NextResponse.json({ success: true, message: 'Inquiry submitted successfully', data: inquiry }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function GET(req, { params }) {
  await connectDB();
  const userReq = await protect(req);
  if (!userReq || !(await admin(userReq))) return NextResponse.json({ success: false, message: 'Not authorized as admin' }, { status: 403 });

  try {
    const searchParams = req.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 20;
    const skip = (page - 1) * limit;

    const inquiries = await ContactInquiry.find().sort({ createdAt: -1 }).skip(skip).limit(limit);
    const total = await ContactInquiry.countDocuments();
    return NextResponse.json({ success: true, count: inquiries.length, total, pages: Math.ceil(total / limit), currentPage: page, data: inquiries }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  await connectDB();
  const resolvedParams = await params;
  const route = resolvedParams?.route || [];
  
  const userReq = await protect(req);
  if (!userReq || !(await admin(userReq))) return NextResponse.json({ success: false, message: 'Not authorized as admin' }, { status: 403 });

  try {
    if (route.length === 1) {
      const id = route[0];
      const { status } = await req.json();
      const inquiry = await ContactInquiry.findById(id);
      if (!inquiry) return NextResponse.json({ success: false, message: 'Inquiry not found' }, { status: 404 });

      inquiry.status = status;
      await inquiry.save();
      return NextResponse.json({ success: true, message: 'Inquiry status updated', data: inquiry }, { status: 200 });
    }
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
  return NextResponse.json({ success: false, message: 'Route not found' }, { status: 404 });
}

export async function DELETE(req, { params }) {
  await connectDB();
  const resolvedParams = await params;
  const route = resolvedParams?.route || [];
  
  const userReq = await protect(req);
  if (!userReq || !(await admin(userReq))) return NextResponse.json({ success: false, message: 'Not authorized as admin' }, { status: 403 });

  try {
    if (route.length === 1) {
      const id = route[0];
      const inquiry = await ContactInquiry.findById(id);
      if (!inquiry) return NextResponse.json({ success: false, message: 'Inquiry not found' }, { status: 404 });

      await inquiry.deleteOne();
      return NextResponse.json({ success: true, message: 'Inquiry deleted' }, { status: 200 });
    }
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
  return NextResponse.json({ success: false, message: 'Route not found' }, { status: 404 });
}
