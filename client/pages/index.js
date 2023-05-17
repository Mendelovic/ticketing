import Link from "next/link";

export default function Home({ currentUser, tickets }) {
  const ticketList = tickets.map((ticket) => (
    <tr key={ticket.id}>
      <td>{ticket.title}</td>
      <td>${ticket.price}</td>
      <td>
        <Link href="/tickets/[ticketId]" as={`/tickets/${ticket.id}`}>
          View
        </Link>
      </td>
      {/* TODO: Add edit ticket price page, owner can change ticket price if ticket is not reserved */}
      {/* {currentUser && currentUser.id === ticket.userId && (
        <td>
          <Link
            href={`/tickets/edit/[ticketId]`}
            as={`/tickets/edit/${ticket.id}`}
          >
            Edit
          </Link>
        </td>
      )} */}
    </tr>
  ));

  return (
    <div>
      <h2>Tickets</h2>
      <table className="table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Price</th>
            <th>Link</th>
          </tr>
        </thead>
        <tbody>{ticketList}</tbody>
      </table>
    </div>
  );
}

Home.getInitialProps = async (ctx, client, currentUser) => {
  const { data } = await client.get("/api/tickets");
  return { tickets: data };
};
