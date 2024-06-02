import * as React from 'react';
import cn from 'classnames';
import { Modal } from '../Modal/Modal';
import s from './CompanyModal.module.scss';

interface CompanyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (company: { id: number; name: string; address: string }) => void;
}

export const CompanyModal = ({ isOpen, onClose, onCreate }: CompanyModalProps) => {
  const [name, setName] = React.useState('');
  const [address, setAddress] = React.useState('');

  const buttonDisabled = !name || !address;

  const handleCreate = () => {
    onCreate({ id: Date.now(), name, address });
    onClose();
    setName('');

    setAddress('');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2>Создать компанию</h2>
      <div className={s.field}>
        <label>
          Название<span className={s.star}>*</span>
        </label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
      </div>

      <div className={s.field}>
        <label>
          Адреc<span className={s.star}>*</span>
        </label>
        <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} required />
      </div>
      <button
        disabled={buttonDisabled}
        className={cn(s.create, { [s.disabled]: buttonDisabled })}
        onClick={handleCreate}>
        Создать
      </button>
    </Modal>
  );
};
