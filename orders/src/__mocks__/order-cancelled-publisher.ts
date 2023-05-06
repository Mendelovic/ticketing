export const orderCancelledPublisher = {
  OrderCancelledPublisher: jest.fn().mockImplementation(() => {
    return {
      publish: jest.fn().mockImplementation(() => {}),
      assertQueue: jest.fn().mockImplementation(() => {}),
    };
  }),
};
