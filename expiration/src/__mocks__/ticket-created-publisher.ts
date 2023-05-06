export const ticketCreatedPublisher = {
  TicketCreatedPublisher: jest.fn().mockImplementation(() => {
    return {
      publish: jest.fn().mockImplementation(() => {}),
      assertQueue: jest.fn().mockImplementation(() => {}),
    };
  }),
};
