import React from 'react';
import ReactDOM from 'react-dom';
import s from './Modal.module.scss';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export const Modal = ({ isOpen, onClose, children }: ModalProps) => {
  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const modalRoot = document.getElementById('modal-root');
  if (!modalRoot) return null;

  return ReactDOM.createPortal(
    <div className={s.overlay} onClick={handleOverlayClick}>
      <div className={s.content}>
        <button className={s.close} onClick={onClose}>
          ×
        </button>
        {children}
      </div>
    </div>,
    modalRoot,
  );
};
