import { useState, useEffect, useCallback } from 'react';
import ContactTable from './components/ContactTable';
import ContactModal from './components/ContactModal';
import ConfirmDialog from './components/ConfirmDialog';
import Toast from './components/Toast';
import * as api from './services/api';

function App() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [search, setSearch] = useState('');

  const [modalOpen, setModalOpen] = useState(false);
  const [editingContact, setEditingContact] = useState(null);
  const [formError, setFormError] = useState('');

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [toast, setToast] = useState(null);

  const loadContacts = useCallback(async (term = '') => {
    setLoading(true);
    setLoadError('');
    try {
      const data = await api.fetchContacts(term);
      setContacts(data);
    } catch (err) {
      setLoadError('Could not load contacts. Is the server running?');
    } finally {
      setLoading(false);
    }
  }, []);

  // initial load
  useEffect(() => {
    loadContacts();
  }, [loadContacts]);

  // debounce search so we don't hit the API on every keystroke
  useEffect(() => {
    const timer = setTimeout(() => loadContacts(search), 300);
    return () => clearTimeout(timer);
  }, [search, loadContacts]);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(timer);
  }, [toast]);

  function openAddModal() {
    setEditingContact(null);
    setFormError('');
    setModalOpen(true);
  }

  function openEditModal(contact) {
    setEditingContact(contact);
    setFormError('');
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setEditingContact(null);
    setFormError('');
  }

  async function handleSave(formData) {
    setFormError('');
    try {
      if (editingContact) {
        const updated = await api.updateContact(editingContact.id, formData);
        setContacts((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
        setToast({ message: 'Contact updated successfully', type: 'success' });
      } else {
        const created = await api.createContact(formData);
        setContacts((prev) => [...prev, created]);
        setToast({ message: 'Contact added successfully', type: 'success' });
      }
      closeModal();
    } catch (err) {
      setFormError(err.message || 'Something went wrong. Please try again.');
    }
  }

  function requestDelete(contact) {
    setDeleteTarget(contact);
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    try {
      await api.deleteContact(deleteTarget.id);
      setContacts((prev) => prev.filter((c) => c.id !== deleteTarget.id));
      setToast({ message: 'Contact deleted', type: 'success' });
    } catch (err) {
      setToast({ message: err.message || 'Could not delete contact', type: 'error' });
    } finally {
      setDeleteTarget(null);
    }
  }

  return (
    <div className="app">
      <header className="app-header">
        <div>
          <h1>Contact Book</h1>
          <p className="subtitle">Manage all your contacts in one place</p>
        </div>
        <button className="btn btn-primary" onClick={openAddModal}>
          + Add Contact
        </button>
      </header>

      <div className="toolbar">
        <input
          className="search-input"
          type="text"
          placeholder="Search by name, email or phone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <span className="contact-count">
          {contacts.length} contact{contacts.length !== 1 ? 's' : ''}
        </span>
      </div>

      {loading && <div className="status-message">Loading contacts...</div>}

      {!loading && loadError && (
        <div className="status-message error">
          {loadError}
          <button className="link-btn" onClick={() => loadContacts(search)}>
            Retry
          </button>
        </div>
      )}

      {!loading && !loadError && (
        <ContactTable contacts={contacts} onEdit={openEditModal} onDelete={requestDelete} />
      )}

      <ContactModal
        isOpen={modalOpen}
        onClose={closeModal}
        onSave={handleSave}
        contact={editingContact}
        serverError={formError}
      />

      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Delete Contact"
        message={
          deleteTarget
            ? `Are you sure you want to delete ${deleteTarget.name}? This cannot be undone.`
            : ''
        }
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />

      <Toast message={toast?.message} type={toast?.type} />
    </div>
  );
}

export default App;
