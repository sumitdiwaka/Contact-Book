function ContactTable({ contacts, onEdit, onDelete }) {
  if (contacts.length === 0) {
    return (
      <div className="empty-state">
        <p>No contacts found</p>
        <span>Add your first contact using the button above.</span>
      </div>
    );
  }

  return (
    <div className="table-wrapper">
      <table className="contact-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Address</th>
            <th className="actions-col">Actions</th>
          </tr>
        </thead>
        <tbody>
          {contacts.map((contact) => (
            <tr key={contact.id}>
              <td data-label="Name">{contact.name}</td>
              <td data-label="Email">{contact.email}</td>
              <td data-label="Phone">{contact.phone}</td>
              <td data-label="Address" className="address-cell">{contact.address || '—'}</td>
              <td data-label="Actions" className="actions-col">
                <button className="btn-icon" onClick={() => onEdit(contact)} title="Edit contact">
                  Edit
                </button>
                <button
                  className="btn-icon danger"
                  onClick={() => onDelete(contact)}
                  title="Delete contact"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ContactTable;
