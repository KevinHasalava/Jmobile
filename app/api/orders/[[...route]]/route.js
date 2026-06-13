import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Order from '@/models/Order';
import Product from '@/models/Product';
import { protect, admin } from '@/lib/auth';
import { sendOrderConfirmationEmail, sendBankSlipVerificationEmail } from '@/utils/emailService';

export async function POST(req, { params }) {
  await connectDB();
  const userReq = await protect(req);
  if (!userReq) return NextResponse.json({ success: false, message: 'Not authorized' }, { status: 401 });

  try {
    const { items, shippingAddress, paymentMethod, itemsPrice, taxPrice, shippingPrice, totalPrice, bankSlip } = await req.json();

    if (!items || items.length === 0) return NextResponse.json({ success: false, message: 'No order items provided' }, { status: 400 });

    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) return NextResponse.json({ success: false, message: `Product not found: ${item.name}` }, { status: 404 });
      if (product.stock < item.quantity) return NextResponse.json({ success: false, message: `Insufficient stock for "${product.name}". Only ${product.stock} left.` }, { status: 400 });
      product.stock -= item.quantity;
      await product.save();
    }

    const orderData = { user: userReq._id, items, shippingAddress, paymentMethod: paymentMethod || 'bank_transfer', itemsPrice: itemsPrice || 0, taxPrice: taxPrice || 0, shippingPrice: shippingPrice || 0, totalPrice: totalPrice || 0, totalAmount: totalPrice || 0 };
    if (bankSlip) {
      orderData.bankSlip = { ...bankSlip, uploadedAt: new Date() };
      orderData.bankSlipStatus = 'pending_review';
    }

    const order = await Order.create(orderData);
    
    // Note: Socket.io removed in favor of polling for Next.js Serverless architecture
    await sendOrderConfirmationEmail(order, userReq);

    return NextResponse.json({ success: true, data: order }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function GET(req, { params }) {
  await connectDB();
  const resolvedParams = await params;
  const route = resolvedParams?.route || [];
  const searchParams = req.nextUrl.searchParams;

  const userReq = await protect(req);
  if (!userReq) return NextResponse.json({ success: false, message: 'Not authorized' }, { status: 401 });

  try {
    if (route[0] === 'myorders') {
      const orders = await Order.find({ user: userReq._id }).populate('items.product', 'name images').sort('-createdAt');
      return NextResponse.json({ success: true, count: orders.length, data: orders }, { status: 200 });
    }

    if (route.length === 1 && route[0] !== 'myorders') {
      const id = route[0];
      const order = await Order.findById(id).populate('user', 'name email').populate('items.product', 'name images');
      if (!order) return NextResponse.json({ success: false, message: 'Order not found' }, { status: 404 });
      if (order.user._id.toString() !== userReq._id.toString() && userReq.role !== 'admin') {
        return NextResponse.json({ success: false, message: 'Not authorized to view this order' }, { status: 403 });
      }
      return NextResponse.json({ success: true, data: order }, { status: 200 });
    }

    if (route.length === 0) {
      if (!(await admin(userReq))) return NextResponse.json({ success: false, message: 'Not authorized as admin' }, { status: 403 });
      const page = parseInt(searchParams.get('page')) || 1;
      const limit = parseInt(searchParams.get('limit')) || 20;
      const skip = (page - 1) * limit;

      const statusFilter = searchParams.get('status') ? { orderStatus: searchParams.get('status') } : {};
      const slipFilter = searchParams.get('slipStatus') ? { bankSlipStatus: searchParams.get('slipStatus') } : {};
      const query = { ...statusFilter, ...slipFilter };

      const [orders, total] = await Promise.all([
        Order.find(query).populate('user', 'name email').populate('items.product', 'name images').sort('-createdAt').skip(skip).limit(limit),
        Order.countDocuments(query),
      ]);
      return NextResponse.json({ success: true, count: orders.length, total, pages: Math.ceil(total / limit), currentPage: page, data: orders }, { status: 200 });
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
    if (route.length === 2) {
      const id = route[0];
      const action = route[1];
      const order = await Order.findById(id).populate('user', 'name email');
      if (!order) return NextResponse.json({ success: false, message: 'Order not found' }, { status: 404 });

      const body = await req.json();

      if (action === 'pay') {
        order.isPaid = true;
        order.paidAt = Date.now();
        order.paymentStatus = 'paid';
        order.paymentResult = { id: body.id, status: body.status, update_time: body.update_time, email_address: body.email_address };
        const updatedOrder = await order.save();
        return NextResponse.json({ success: true, data: updatedOrder }, { status: 200 });
      }

      if (!(await admin(userReq))) return NextResponse.json({ success: false, message: 'Not authorized as admin' }, { status: 403 });

      if (action === 'deliver') {
        order.isDelivered = true;
        order.deliveredAt = Date.now();
        order.orderStatus = 'delivered';
        const updatedOrder = await order.save();
        return NextResponse.json({ success: true, data: updatedOrder }, { status: 200 });
      }

      if (action === 'status') {
        const { orderStatus, paymentStatus } = body;
        if (orderStatus) order.orderStatus = orderStatus;
        if (paymentStatus) order.paymentStatus = paymentStatus;
        if (orderStatus === 'delivered' && !order.isDelivered) { order.isDelivered = true; order.deliveredAt = new Date(); }
        const updatedOrder = await order.save();
        return NextResponse.json({ success: true, data: updatedOrder }, { status: 200 });
      }

      if (action === 'verify-slip') {
        const { action: slipAction, rejectionReason } = body;
        if (!['approve', 'reject'].includes(slipAction)) return NextResponse.json({ success: false, message: 'Action must be "approve" or "reject"' }, { status: 400 });

        if (slipAction === 'approve') {
          order.bankSlipStatus = 'approved';
          order.paymentStatus = 'paid';
          order.isPaid = true;
          order.paidAt = new Date();
          order.orderStatus = 'processing';
        } else {
          order.bankSlipStatus = 'rejected';
          order.bankSlipRejectionReason = rejectionReason || 'Slip could not be verified';
          order.paymentStatus = 'failed';
        }
        const updatedOrder = await order.save();
        await sendBankSlipVerificationEmail(updatedOrder);
        return NextResponse.json({ success: true, message: `Bank slip ${slipAction === 'approve' ? 'approved' : 'rejected'} successfully`, data: updatedOrder }, { status: 200 });
      }
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
  if (!userReq) return NextResponse.json({ success: false, message: 'Not authorized' }, { status: 401 });

  try {
    if (route.length === 1) {
      const id = route[0];
      const order = await Order.findById(id);
      if (!order) return NextResponse.json({ success: false, message: 'Order not found' }, { status: 404 });
      if (!['pending', 'processing'].includes(order.orderStatus)) return NextResponse.json({ success: false, message: 'Cannot cancel order that is already shipped or delivered' }, { status: 400 });

      for (const item of order.items) {
        const product = await Product.findById(item.product);
        if (product) { product.stock += item.quantity; await product.save(); }
      }

      order.orderStatus = 'cancelled';
      await order.save();
      return NextResponse.json({ success: true, message: 'Order cancelled successfully' }, { status: 200 });
    }
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
  return NextResponse.json({ success: false, message: 'Route not found' }, { status: 404 });
}
