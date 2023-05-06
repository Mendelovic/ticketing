export const orderCreatedPublisher = {
  OrderCreatedPublisher: jest.fn().mockImplementation(() => {
    return {
      publish: jest.fn().mockImplementation(() => {}),
      assertQueue: jest.fn().mockImplementation(() => {}),
    };
  }),
};
