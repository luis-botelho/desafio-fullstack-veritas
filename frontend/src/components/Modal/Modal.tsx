import type { ReactNode } from "react";

import "./Modal.css";

interface ModalProps {
  title: string;
  eyebrow?: string;
  children: ReactNode;
  headerActions?: ReactNode;
  onClose: () => void;
}

export function Modal({
  title,
  eyebrow,
  children,
  headerActions,
  onClose,
}: ModalProps) {
  return (
    <div
      className="modal-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <section
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <header className="modal__header">
          <div>
            {eyebrow && (
              <p className="modal__eyebrow">
                {eyebrow}
              </p>
            )}

            <h2 id="modal-title">
              {title}
            </h2>
          </div>

          <div className="modal__header-actions">
            {headerActions}

            <button
              type="button"
              className="modal__close-button"
              aria-label="Fechar modal"
              onClick={onClose}
            >
              ×
            </button>
          </div>
        </header>

        <div className="modal__content">
          {children}
        </div>
      </section>
    </div>
  );
}
