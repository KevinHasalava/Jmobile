import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Conversation from '@/models/Conversation';
import Message from '@/models/Message';
import { protect, admin as checkAdmin } from '@/lib/auth';

export async function POST(req, { params }) {
  await connectDB();
  const resolvedParams = await params;
  const route = resolvedParams?.route || [];
  
  const userReq = await protect(req);
  if (!userReq) return NextResponse.json({ success: false, message: 'Not authorized' }, { status: 401 });

  try {
    if (route[0] === 'conversation') {
      const customerId = userReq._id;
      let conversation = await Conversation.findOne({ customer: customerId }).populate('customer', 'name email');
      if (!conversation) {
        conversation = await Conversation.create({ customer: customerId });
        conversation = await Conversation.findById(conversation._id).populate('customer', 'name email');
      }
      return NextResponse.json({ success: true, data: conversation }, { status: 200 });
    }

    if (route[0] === 'message') {
      const { conversationId, content, messageType, imageUrl } = await req.json();
      if (!conversationId || !content) return NextResponse.json({ success: false, message: 'Conversation ID and content are required' }, { status: 400 });

      const conversation = await Conversation.findById(conversationId);
      if (!conversation) return NextResponse.json({ success: false, message: 'Conversation not found' }, { status: 404 });

      const isAdmin = userReq.role === 'admin';
      const isCustomer = conversation.customer.toString() === userReq._id.toString();
      if (!isAdmin && !isCustomer) return NextResponse.json({ success: false, message: 'Not authorized' }, { status: 403 });

      const message = await Message.create({ conversationId, sender: userReq._id, senderModel: isAdmin ? 'Admin' : 'User', content, messageType: messageType || 'text', imageUrl });
      
      conversation.lastMessage = content.substring(0, 100);
      conversation.lastMessageAt = Date.now();
      if (isAdmin) conversation.unreadCount.customer += 1;
      else conversation.unreadCount.admin += 1;
      await conversation.save();

      await message.populate('sender', 'name email');
      return NextResponse.json({ success: true, data: message }, { status: 201 });
    }
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
  return NextResponse.json({ success: false, message: 'Route not found' }, { status: 404 });
}

export async function GET(req, { params }) {
  await connectDB();
  const resolvedParams = await params;
  const route = resolvedParams?.route || [];
  const searchParams = req.nextUrl.searchParams;
  
  const userReq = await protect(req);
  if (!userReq) return NextResponse.json({ success: false, message: 'Not authorized' }, { status: 401 });

  try {
    if (route[0] === 'conversations') {
      if (!(await checkAdmin(userReq))) return NextResponse.json({ success: false, message: 'Not authorized as admin' }, { status: 403 });
      const conversations = await Conversation.find().populate('customer', 'name email').sort({ lastMessageAt: -1 });
      return NextResponse.json({ success: true, count: conversations.length, data: conversations }, { status: 200 });
    }

    if (route[0] === 'messages' && route.length === 2) {
      const conversationId = route[1];
      const page = parseInt(searchParams.get('page')) || 1;
      const limit = parseInt(searchParams.get('limit')) || 50;
      const skip = (page - 1) * limit;

      const conversation = await Conversation.findById(conversationId);
      if (!conversation) return NextResponse.json({ success: false, message: 'Conversation not found' }, { status: 404 });

      if (userReq.role !== 'admin' && conversation.customer.toString() !== userReq._id.toString()) {
        return NextResponse.json({ success: false, message: 'Not authorized' }, { status: 403 });
      }

      const messages = await Message.find({ conversationId }).populate('sender', 'name email').sort({ createdAt: 1 }).skip(skip).limit(limit);
      const total = await Message.countDocuments({ conversationId });
      return NextResponse.json({ success: true, count: messages.length, total, pages: Math.ceil(total / limit), currentPage: page, data: messages }, { status: 200 });
    }

    if (route[0] === 'unread') {
      const isAdmin = userReq.role === 'admin';
      let unreadCount = 0;
      if (isAdmin) {
        const conversations = await Conversation.find();
        unreadCount = conversations.reduce((sum, conv) => sum + conv.unreadCount.admin, 0);
      } else {
        const conversation = await Conversation.findOne({ customer: userReq._id });
        unreadCount = conversation ? conversation.unreadCount.customer : 0;
      }
      return NextResponse.json({ success: true, data: { unreadCount } }, { status: 200 });
    }
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
  return NextResponse.json({ success: false, message: 'Route not found' }, { status: 404 });
}

export async function PUT(req, { params }) {
  await connectDB();
  const resolvedParams = await params;
  const route = resolvedParams?.route || [];
  
  const userReq = await protect(req);
  if (!userReq) return NextResponse.json({ success: false, message: 'Not authorized' }, { status: 401 });

  try {
    if (route[0] === 'messages' && route[1] === 'read' && route.length === 3) {
      const conversationId = route[2];
      const isAdmin = userReq.role === 'admin';
      const conversation = await Conversation.findById(conversationId);
      if (!conversation) return NextResponse.json({ success: false, message: 'Conversation not found' }, { status: 404 });

      const senderModel = isAdmin ? 'User' : 'Admin';
      await Message.updateMany({ conversationId, senderModel, isRead: false }, { $set: { isRead: true, readAt: new Date() } });

      if (isAdmin) conversation.unreadCount.admin = 0;
      else conversation.unreadCount.customer = 0;
      await conversation.save();
      return NextResponse.json({ success: true, message: 'Messages marked as read' }, { status: 200 });
    }

    if (route[0] === 'conversation' && route[2] === 'close') {
      const id = route[1];
      if (!(await checkAdmin(userReq))) return NextResponse.json({ success: false, message: 'Not authorized as admin' }, { status: 403 });
      
      const conversation = await Conversation.findById(id);
      if (!conversation) return NextResponse.json({ success: false, message: 'Conversation not found' }, { status: 404 });

      conversation.status = 'closed';
      await conversation.save();
      return NextResponse.json({ success: true, message: 'Conversation closed', data: conversation }, { status: 200 });
    }
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
  return NextResponse.json({ success: false, message: 'Route not found' }, { status: 404 });
}
