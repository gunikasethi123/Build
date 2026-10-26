
import { X } from 'lucide-react';

export function Modal({ title, onClose, children }) {
  return (
    <div
      className="modal-backdrop"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <section className="modal-card">
        <div className="modal-head">
          <h2>{title}</h2>
          <button
            className="icon-button"
            onClick={onClose}
            aria-label="Close"
            type="button"
          >
            <X size={18} />
          </button>
        </div>

        {children}
      </section>
    </div>
  );
}

export function Field({ label, children, wide }) {
  return (
    <label className={`field ${wide ? 'field-wide' : ''}`}>
      <span>{label}</span>
      {children}
    </label>
  );
}
