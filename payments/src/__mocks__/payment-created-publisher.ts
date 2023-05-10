export const paymentCreatedPublisher = {
  PaymentCreatedPublisher: jest.fn().mockImplementation(() => {
    return {
      publish: jest.fn().mockImplementation(() => {}),
      assertQueue: jest.fn().mockImplementation(() => {}),
    };
  }),
};
