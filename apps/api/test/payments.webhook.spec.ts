import { PaymentsService } from '../src/payments/payments.service';

describe('PaymentsService webhook', () => {
  it('marks order as paid when webhook succeeds', async () => {
    process.env.STRIPE_SECRET_KEY = 'sk_test_123';
    const ordersService = { markAsPaid: jest.fn(), getOrder: jest.fn() } as any;
    const prisma = { payment: { upsert: jest.fn() } } as any;
    const service = new PaymentsService(ordersService, prisma);

    (service as any).stripe = {
      webhooks: {
        constructEvent: jest.fn().mockReturnValue({
          type: 'payment_intent.succeeded',
          data: {
            object: {
              id: 'pi_1',
              metadata: { orderId: 'order-123' }
            }
          }
        })
      }
    } as any;

    await service.handleWebhook('sig', Buffer.from('{}'));
    expect(ordersService.markAsPaid).toHaveBeenCalledWith('order-123', 'pi_1');
  });
});
