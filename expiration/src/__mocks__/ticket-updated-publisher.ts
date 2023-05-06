export const ticketUpdatedPublisher = {
  TicketUpdatedPublisher: jest.fn().mockImplementation(() => {
    return {
      publish: jest.fn().mockImplementation(() => {}),
      assertQueue: jest.fn().mockImplementation(() => {}),
    };
  }),
};
