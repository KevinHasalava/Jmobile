const { Resend } = require('resend');

// Only initialize if API key is present
const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;
const FROM_EMAIL = process.env.FROM_EMAIL || 'JM Mobiles <orders@jmmobiles.com>';

/**
 * Send an email notification for a new order.
 * @param {Object} order - The created order document.
 * @param {Object} user - The user document.
 */
const sendOrderConfirmationEmail = async (order, user) => {
  if (!resend) {
    console.log('[EmailService] Skipped order confirmation email. RESEND_API_KEY not configured.');
    return;
  }

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: user.email,
      subject: `Order Confirmation - ${order._id}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
          <h2 style="color: #FF8C00;">Thank you for your order!</h2>
          <p>Hi ${user.name},</p>
          <p>We've received your order <strong>#${order._id}</strong>.</p>
          ${
            order.paymentMethod === 'bank_transfer'
              ? `<p>We are currently reviewing your uploaded bank slip. Once verified, we will begin processing your order.</p>`
              : `<p>We will begin processing your order immediately.</p>`
          }
          <div style="background-color: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0;"><strong>Total Amount:</strong> Rs. ${order.totalPrice}</p>
            <p style="margin: 5px 0 0 0;"><strong>Shipping Address:</strong> ${order.shippingAddress.street}, ${order.shippingAddress.city}</p>
          </div>
          <p>You can track the status of your order in your account dashboard.</p>
          <p>Best regards,<br/>The JM Mobiles Team</p>
        </div>
      `,
    });
    console.log(`[EmailService] Order confirmation sent to ${user.email}`);
  } catch (error) {
    console.error('[EmailService] Error sending order confirmation:', error);
  }
};

/**
 * Send an email notification when a bank slip is verified (approved/rejected).
 * @param {Object} order - The updated order document.
 */
const sendBankSlipVerificationEmail = async (order) => {
  if (!resend) {
    console.log('[EmailService] Skipped bank slip email. RESEND_API_KEY not configured.');
    return;
  }
  
  if (!order.user || !order.user.email) return;

  const isApproved = order.bankSlipStatus === 'approved';

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: order.user.email,
      subject: `Payment ${isApproved ? 'Approved' : 'Rejected'} - Order ${order._id}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
          <h2 style="color: ${isApproved ? '#22c55e' : '#ef4444'};">
            Payment ${isApproved ? 'Approved' : 'Rejected'}
          </h2>
          <p>Hi ${order.user.name},</p>
          <p>Your bank transfer payment for order <strong>#${order._id}</strong> has been ${isApproved ? 'approved' : 'rejected'}.</p>
          
          ${isApproved 
            ? `<p>Your order is now processing and will be shipped soon.</p>`
            : `<p><strong>Reason for rejection:</strong> ${order.bankSlipRejectionReason}</p>
               <p>Please contact support or try uploading a valid payment slip.</p>`
          }
          
          <p>Best regards,<br/>The JM Mobiles Team</p>
        </div>
      `,
    });
    console.log(`[EmailService] Bank slip verification sent to ${order.user.email}`);
  } catch (error) {
    console.error('[EmailService] Error sending bank slip verification:', error);
  }
};

module.exports = {
  sendOrderConfirmationEmail,
  sendBankSlipVerificationEmail,
};
