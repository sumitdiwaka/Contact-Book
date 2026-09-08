import { useState, useEffect } from 'react';
import { validateContactForm } from '../utils/validate';

const emptyForm = { name: '', email: '', phone: '', address: '' };

function ContactModal({ isOpen, onClose, onSave, contact, serverError }) {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [touched, setTouched] = useState({});

  // reset the form whenever the modal opens, or switches between add/edit
  useEffect(() => {
    if (contact) {
      setForm({
        name: contact.name || '',
        email: contact.email || '',
        phone: contact.phone || '',
        address: contact.address || '',
      });
    } else {
      setForm(emptyForm);
    }
    setErrors({});
    setTouched({});
  }, [contact, isOpen]);

  if (!isOpen) return null;

  function handleChange(e) {
    const { name, value } = e.target;
    const updatedForm = { ...form, [name]: value };
    setForm(updatedForm);

    if (touched[name]) {
      const fieldErrors = validateContactForm(updatedForm);
      setErrors((prev) => ({ ...prev, [name]: fieldErrors[name] }));
    }
  }

  function handlePhoneChange(e) {
    const digitsOnly = e.target.value.replace(/\D/g, '').slice(0, 10);
    const updatedForm = { ...form, phone: digitsOnly };
    setForm(updatedForm);

    if (touched.phone) {
      const fieldErrors = validateContactForm(updatedForm);
      setErrors((prev) => ({ ...prev, phone: fieldErrors.phone }));
    }
  }

  function handleBlur(e) {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const fieldErrors = validateContactForm(form);
    setErrors((prev) => ({ ...prev, [name]: fieldErrors[name] }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const validationErrors = validateContactForm(form);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setSubmitting(true);
    try {
      await onSave(form);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{contact ? 'Edit Contact' : 'Add Contact'}</h2>
          <button className="icon-btn" onClick={onClose} aria-label="Close">
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              id="name"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="e.g. Priya Sharma"
              className={errors.name ? 'input-error' : ''}
              autoFocus
            />
            {errors.name && <span className="field-error">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onBlur={handleBlur}
              onChange={handleChange}
              placeholder="e.g. priya@example.com"
              className={errors.email ? 'input-error' : ''}
            />
            {errors.email && <span className="field-error">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="phone">Phone</label>
            <input
              id="phone"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              onBlur={handleBlur}
              inputMode="numeric"
              maxLength={10}
              placeholder="e.g. +91 98765 43210"
              className={errors.phone ? 'input-error' : ''}
            />
            {errors.phone && <span className="field-error">{errors.phone}</span>}
            {!errors.phone && form.phone.length === 10 && (
              <span className="field-success">Looks good ✓</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="address">Address (optional)</label>
            <textarea
              id="address"
              name="address"
              value={form.address}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Street, city, state"
              rows={3}
              className={errors.address ? 'input-error' : ''}
            />
            {errors.address && <span className="field-error">{errors.address}</span>}
          </div>

          {serverError && <div className="form-error">{serverError}</div>}

          <div className="modal-actions">
            <button type="button" className="btn btn-ghost" onClick={onClose} disabled={submitting}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Saving...' : contact ? 'Save Changes' : 'Add Contact'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ContactModal;
