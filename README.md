# Contact Book

A single-user Contact Book application. React (Vite) on the frontend, Node.js
+ Express on the backend, contacts persisted to a JSON file on disk.

## Tech Stack

- **Frontend:** React 18, Vite, plain CSS (no UI library, hand-styled)
- **Backend:** Node.js, Express
- **Storage:** JSON file (`backend/data/contacts.json`) — no database setup
  needed, but structured so swapping in MongoDB/Postgres later only touches
  `data/store.js`
- **Auth:** none, by design (single-user app per the assignment spec)

## Project Structure

```
contact-book/
├── backend/
│   ├── server.js                 # Express app setup, middleware, error handler
│   ├── routes/contacts.js        # Route → controller wiring
│   ├── controllers/
│   │   └── contactController.js  # CRUD logic, business rules (e.g. duplicate email check)
│   ├── data/
│   │   ├── store.js               # Read/write helpers for the JSON file
│   │   └── contacts.json          # The actual data (starts empty)
│   └── utils/validate.js          # Server-side validation rules
│
└── frontend/
    └── src/
        ├── App.jsx                # Top-level state: contacts, search, modals, toasts
        ├── components/
        │   ├── ContactTable.jsx   # Renders the contact list, empty state included
        │   ├── ContactModal.jsx   # Add/Edit form with client-side validation
        │   ├── ConfirmDialog.jsx  # "Are you sure?" before delete
        │   └── Toast.jsx          # Success/error notifications
        ├── services/api.js        # All fetch() calls to the backend live here
        └── utils/validate.js      # Same validation rules as the backend, for instant feedback
```

## Running It

You need two terminals — one for the API, one for the UI.

**Backend**
```bash
cd backend
npm install
npm start          # or: npm run dev (uses nodemon)
```
Runs on `http://localhost:5000`.

**Frontend**
```bash
cd frontend
npm install
npm run dev
```
Runs on `http://localhost:3000` and talks to the API at `http://localhost:5000`.

## API Reference

| Method | Endpoint             | Description                     |
|--------|----------------------|----------------------------------|
| GET    | `/api/contacts`      | List all contacts. Supports `?search=` |
| GET    | `/api/contacts/:id`  | Get one contact                 |
| POST   | `/api/contacts`      | Create a contact                |
| PUT    | `/api/contacts/:id`  | Update a contact                |
| DELETE | `/api/contacts/:id`  | Delete a contact                |

**Contact shape**
```json
{
  "id": "uuid",
  "name": "Priya Sharma",
  "email": "priya@example.com",
  "phone": "+91 98765 43210",
  "address": "Delhi",
  "createdAt": "2026-09-08T08:41:33.678Z"
}
```

## Validation Rules

Applied on both the client (for instant feedback) and the server (as the
source of truth — a client can always be bypassed with a direct API call).
On the frontend, fields are validated live as the user types/blurs, not just
on submit:

- **Name:** required, min 2 characters — validated on blur, then live as you type
- **Email:** required, must match a standard email pattern — validated on blur, then live as you type
- **Phone:** required, exactly 10 digits (or 12 digits with a `91` country code prefix). Non-digit characters are stripped automatically and typing is capped at 10 digits — you physically can't type an 11th digit. A green "Looks good ✓" message confirms once 10 valid digits are entered.
- **Address:** optional, max 200 characters

## Edge Cases Handled

**Backend**
- Missing/empty required fields → `400` with a field-by-field error object
- Invalid email format → `400`
- Duplicate email on create or update → `409 Conflict`
- Updating/deleting/fetching a contact that doesn't exist → `404`
- Malformed JSON in the request body → `400` (caught by a global error handler, doesn't crash the server)
- Unknown routes → `404`
- Inputs are trimmed and emails lowercased before saving, so `" A@B.com "` and `"a@b.com"` aren't treated as different contacts

**Frontend**
- Form can't be submitted with invalid/empty fields — errors shown inline per field
- Submit button disabled and shows "Saving..." while a request is in flight, so a slow network can't cause duplicate submissions
- Server-side errors (e.g. duplicate email caught at save time) are surfaced in the form, not just logged
- Delete requires confirmation in a separate dialog
- Empty contact list shows a friendly empty state instead of a blank table
- Failed initial load shows an error message with a Retry button instead of a blank screen
- Search input is debounced (300ms) so it doesn't fire a request on every keystroke
- Fields show validation errors on blur (not just on submit) — a wrong email is flagged the moment the user tabs away, not after they hit "Add Contact"
- Phone input only accepts digits and auto-truncates at 10 characters, so it's impossible to type a malformed or overly long number in the first place
- A field-level success indicator confirms once the phone number is complete and valid

## What Was Intentionally Skipped

Per the assignment scope:
- No authentication/login (single-user app)
- No rate limiting
- No deep server-side sanitization beyond format/required-field validation (no SQL injection concerns since there's no database/query layer)

## Possible Next Steps

- Swap the JSON file for a real database (the `data/store.js` file is the
  only place that would need to change)
- Add pagination if the contact list grows large
- Add sorting by column in the table
