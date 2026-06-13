const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        name: { type: String, required: true },
        quantity: { type: Number, required: true, min: 1 },
        price: { type: Number, required: true },
        image: String,
      },
    ],
    shippingAddress: {
      fullName: { type: String, required: true },
      phone: { type: String, required: true },
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      zipCode: { type: String, required: true },
      country: { type: String, required: true },
    },
    paymentMethod: {
      type: String,
      required: true,
      // 'bank_transfer' added — was missing, causing Checkout to fail
      enum: ['cash', 'card', 'upi', 'netbanking', 'bank_transfer'],
      default: 'bank_transfer',
    },
    // ─── Bank slip payment details ───────────────────────────────
    bankSlip: {
      filename: String,
      path: String,
      depositorName: String,
      transactionId: String,
      uploadedAt: Date,
    },
    // Status of manual bank slip verification by admin
    bankSlipStatus: {
      type: String,
      enum: ['pending_review', 'approved', 'rejected'],
      default: 'pending_review',
    },
    bankSlipRejectionReason: {
      type: String,
      default: '',
    },
    // ─── Pricing ─────────────────────────────────────────────────
    itemsPrice: { type: Number, required: true, default: 0 },
    taxPrice: { type: Number, required: true, default: 0 },
    shippingPrice: { type: Number, required: true, default: 0 },
    totalAmount: { type: Number, required: true, default: 0 },
    totalPrice: { type: Number, required: true, default: 0 },
    // ─── Payment status ───────────────────────────────────────────
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending',
    },
    paymentResult: {
      id: String,
      status: String,
      update_time: String,
      email_address: String,
    },
    // ─── Order status ─────────────────────────────────────────────
    orderStatus: {
      type: String,
      enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
      default: 'pending',
    },
    isPaid: { type: Boolean, default: false },
    paidAt: Date,
    isDelivered: { type: Boolean, default: false },
    deliveredAt: Date,
  },
  {
    // Use mongoose timestamps instead of manual createdAt
    timestamps: true,
  }
);

module.exports = mongoose.models.Order || mongoose.model('Order', orderSchema);
