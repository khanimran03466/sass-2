const express = require('express');
const prisma = require('../config/prisma');
const asyncHandler = require('../utils/asyncHandler');
const { verifyRazorpayWebhookSignature } = require('../utils/payment');

const router = express.Router();

router.post(
  '/',
  asyncHandler(async (req, res) => {
    const signature = req.headers['x-razorpay-signature'];
    const payloadString = req.body.toString();
    const payload = JSON.parse(payloadString);
    const signatureValid = verifyRazorpayWebhookSignature(payloadString, signature);
    const entity = payload?.payload?.payment?.entity || payload?.payload?.order?.entity;

    await prisma.webhookLog.create({
      data: {
        event: payload.event,
        entityId: entity?.id,
        signatureValid,
        payload,
        processed: false
      }
    });

    if (!signatureValid) {
      return res.status(400).json({
        success: false,
        message: 'Invalid webhook signature'
      });
    }

    if (payload.event === 'payment.captured') {
      const paymentEntity = payload.payload.payment.entity;

      const payment = await prisma.payment.findFirst({
        where: {
          razorpayOrderId: paymentEntity.order_id
        }
      });

      if (payment) {
        await prisma.payment.update({
          where: { id: payment.id },
          data: {
            status: 'SUCCESS',
            razorpayPaymentId: paymentEntity.id
          }
        });

        if (payment.purpose === 'CREDIT_CARD') {
          await prisma.creditCardPayment.updateMany({
            where: { paymentId: payment.id },
            data: { status: 'SUCCESS' }
          });
        }

        if (payment.purpose === 'FLIGHT') {
          await prisma.flightBooking.updateMany({
            where: { paymentId: payment.id },
            data: { status: 'CONFIRMED' }
          });
        }

        if (payment.purpose === 'HOTEL') {
          await prisma.hotelBooking.updateMany({
            where: { paymentId: payment.id },
            data: { status: 'CONFIRMED' }
          });
        }

        if (payment.purpose === 'RECHARGE') {
          await prisma.rechargeTransaction.updateMany({
            where: { paymentId: payment.id },
            data: { status: 'SUCCESS' }
          });
        }

        if (payment.purpose === 'BILL') {
          await prisma.billPayment.updateMany({
            where: { paymentId: payment.id },
            data: { status: 'SUCCESS' }
          });
        }
      }
    }

    if (payload.event === 'payment.failed') {
      const paymentEntity = payload.payload.payment.entity;
      const payment = await prisma.payment.findFirst({
        where: {
          razorpayOrderId: paymentEntity.order_id
        }
      });

      if (payment) {
        await prisma.payment.update({
          where: { id: payment.id },
          data: {
            status: 'FAILED'
          }
        });

        if (payment.purpose === 'CREDIT_CARD') {
          await prisma.creditCardPayment.updateMany({
            where: { paymentId: payment.id },
            data: { status: 'FAILED' }
          });
        }

        if (payment.purpose === 'RECHARGE') {
          await prisma.rechargeTransaction.updateMany({
            where: { paymentId: payment.id },
            data: { status: 'FAILED' }
          });
        }

        if (payment.purpose === 'BILL') {
          await prisma.billPayment.updateMany({
            where: { paymentId: payment.id },
            data: { status: 'FAILED' }
          });
        }

        if (payment.purpose === 'FLIGHT') {
          await prisma.flightBooking.updateMany({
            where: { paymentId: payment.id },
            data: { status: 'FAILED' }
          });
        }

        if (payment.purpose === 'HOTEL') {
          await prisma.hotelBooking.updateMany({
            where: { paymentId: payment.id },
            data: { status: 'FAILED' }
          });
        }
      }
    }

    if (payload.event === 'refund.processed') {
      const refundEntity = payload.payload.refund.entity;
      const payment = await prisma.payment.findFirst({
        where: {
          razorpayPaymentId: refundEntity.payment_id
        }
      });

      if (payment) {
        await prisma.payment.update({
          where: { id: payment.id },
          data: {
            status: 'REFUNDED',
            razorpayRefundId: refundEntity.id
          }
        });
      }
    }

    await prisma.webhookLog.updateMany({
      where: {
        entityId: entity?.id,
        event: payload.event
      },
      data: {
        processed: true
      }
    });

    return res.status(200).json({ success: true });
  })
);

module.exports = router;
